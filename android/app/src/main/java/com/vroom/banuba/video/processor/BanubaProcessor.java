package com.vroom.banuba.video.processor;

import static com.vroom.banuba.utils.Constants.BANUBA_DIRECTORY;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.Uri;
import android.os.Handler;
import android.util.Size;

import androidx.annotation.NonNull;

import com.banuba.sdk.effect_player.ConsistencyMode;
import com.banuba.sdk.effect_player.EffectPlayer;
import com.banuba.sdk.effect_player.EffectPlayerConfiguration;
import com.banuba.sdk.effect_player.NnMode;
import com.banuba.sdk.internal.utils.OrientationHelper;
import com.banuba.sdk.offscreen.BufferAllocator;
import com.banuba.sdk.offscreen.ImageProcessResult;
import com.banuba.sdk.offscreen.OffscreenEffectPlayer;
import com.banuba.sdk.offscreen.OffscreenSimpleConfig;
import com.banuba.sdk.recognizer.FaceSearchMode;
import com.banuba.sdk.types.FullImageData;
import com.banuba.sdk.manager.BanubaSdkManager;
import com.oney.WebRTCModule.GetUserMediaImpl;
import com.vroom.banuba.utils.BackgroundType;

import org.webrtc.JavaI420Buffer;
import org.webrtc.JniCommon;
import org.webrtc.VideoFrame;

import java.nio.ByteBuffer;
import java.util.LinkedList;
import java.util.Objects;
import java.util.Queue;

public class BanubaProcessor implements IVideoFrameProcessor {
    private OffscreenEffectPlayer mEffectPlayer;
    private boolean mProcessorEnabled = false;
    private boolean shouldCameraCapture = false;
    private boolean isEffectLoading = false;
    private Handler mHandler;
    private final BuffersQueue mBuffersQueue = new BuffersQueue();
    private static final int framesDivider = 50;
    private Context mContext;
    private int mLastFrameRotation = 0;
    final private boolean debugSaveFrames = false;

    @Override
    public void onCaptureCreate(Context context, Handler handler, int width, int height) {
        this.mContext = context;
        this.mHandler = handler;

        EffectPlayerConfiguration ep_config = new EffectPlayerConfiguration(
                width, height,
                NnMode.AUTOMATICALLY,
                FaceSearchMode.MEDIUM,
                false,
                false
        );
        EffectPlayer ext_ep = Objects.requireNonNull(EffectPlayer.create(ep_config));
        ext_ep.setRenderConsistencyMode(ConsistencyMode.ASYNCHRONOUS_CONSISTENT);

        OffscreenSimpleConfig oep_config = OffscreenSimpleConfig.newBuilder(mBuffersQueue)
                .setDebugSaveFrames(debugSaveFrames).setDebugSaveFramesDivider(framesDivider)
                .build();
        mEffectPlayer = new OffscreenEffectPlayer(context, ext_ep, new Size(width, height), oep_config);
        mEffectPlayer.setImageProcessListener(oepImageResult -> {
            if (!isEffectLoading && oepImageResult.getOrientation().getRotationAngle() == mLastFrameRotation) {
                VideoFrame videoFrame = convertOEPImageResult2VideoFrame(oepImageResult);
                VideoFrame newVideoFrame = new VideoFrame(videoFrame.getBuffer().toI420(), videoFrame.getRotation(), videoFrame.getTimestampNs());
                GetUserMediaImpl.videoSource.getCapturerObserver().onFrameCaptured(newVideoFrame);
                newVideoFrame.release();
            }
        }, mHandler);
    }

    @Override
    public void onCaptureStarted() {
    }

    @Override
    public void onCaptureStopped() {
    }

    @Override
    public void onCaptureDestroy() {
        mEffectPlayer.release();
    }

    @Override
    public void pushVideoFrame(VideoFrame videoFrame, boolean isFrontCamera) {
        mLastFrameRotation = videoFrame.getRotation();

        if (!mProcessorEnabled) {
            VideoFrame newVideoFrame = new VideoFrame(videoFrame.getBuffer().toI420(), videoFrame.getRotation(), videoFrame.getTimestampNs());
            GetUserMediaImpl.videoSource.getCapturerObserver().onFrameCaptured(videoFrame);
            newVideoFrame.release();
            return;
        }
        VideoFrame.I420Buffer i420Buffer = videoFrame.getBuffer().toI420();
        int width = i420Buffer.getWidth();
        int height = i420Buffer.getHeight();

        final boolean isRequireMirroring = isFrontCamera;
        @SuppressLint("RestrictedApi") int deviceOrientationAngle = OrientationHelper.getInstance(mContext).getDeviceOrientationAngle();
        if (!isFrontCamera) {
            if (deviceOrientationAngle == 0) {
                deviceOrientationAngle = 180;
            } else if (deviceOrientationAngle == 180) {
                deviceOrientationAngle = 0;
            }
        }

        @SuppressLint("RestrictedApi") final FullImageData.Orientation orientation = OrientationHelper.getOrientation(
            videoFrame.getRotation(),
                deviceOrientationAngle,
            !isRequireMirroring);

        FullImageData fullImageData = new FullImageData(new Size(width, height), i420Buffer.getDataY(),
                i420Buffer.getDataU(), i420Buffer.getDataV(), i420Buffer.getStrideY(),
                i420Buffer.getStrideU(), i420Buffer.getStrideV(), 1, 1, 1, orientation);
        mEffectPlayer.processFullImageData(fullImageData, () -> mHandler.post(() -> i420Buffer.release()), videoFrame.getTimestampNs());
    }

    public VideoFrame convertOEPImageResult2VideoFrame(ImageProcessResult result) {
        final ByteBuffer buffer = result.getBuffer();
        mBuffersQueue.retainBuffer(buffer);

        JavaI420Buffer I420buffer = JavaI420Buffer.wrap(
                result.getWidth(), result.getHeight(),
                result.getPlaneBuffer(0), result.getBytesPerRowOfPlane(0), // Y plane
                result.getPlaneBuffer(1), result.getBytesPerRowOfPlane(1), // U plane
                result.getPlaneBuffer(2), result.getBytesPerRowOfPlane(2), // V plane
                () -> {
                    JniCommon.nativeFreeByteBuffer(buffer);
                });
        return new VideoFrame(I420buffer, result.getOrientation().getRotationAngle(), result.getTimestamp());
    }

    private Uri maskUri(String background) {
        return Uri.parse(BanubaSdkManager.getResourcesBase())
                .buildUpon()
                .appendPath("effects")
                .appendPath(background)
                .build();
    }


    @Override
    public void applyBackground(String background, String uri) {
        BackgroundType backgroundType = BackgroundType.fromString(background);
        switch (backgroundType){
            case Office1:
            case Office2:
            case Office3:
            case Office4:
            case Natural1:
            case Natural2:
            case Natural3:
            case Blur1:
            case Blur2:
            case Room1:
            case True1:
            case True2:
            case True3:
                isEffectLoading = true;
                mEffectPlayer.loadEffect(maskUri(background).toString());
                try {
                    Thread.sleep(300);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                isEffectLoading = false;
                mProcessorEnabled = true;
                break;
            case Custom:
            case None:
            default:
                mEffectPlayer.unloadEffect();
                mProcessorEnabled = false;
                break;
        }
    }

    @Override
    public void setShouldCameraCapture(Boolean isEnabled) {
        this.shouldCameraCapture = isEnabled;
    }

    @Override
    public Boolean getShouldCameraCapture() {
        return this.shouldCameraCapture;
    }

    @Override
    public void callJsMethod(String method, String param) {
        mEffectPlayer.callJsMethod(method, param);
    }

    @Override
    public void loadEffect(String effectName) {
        mEffectPlayer.loadEffect(effectName);
    }

    @Override
    public void unloadEffect() {
        mEffectPlayer.unloadEffect();
    }

    @Override
    public void setProcessorEnabled(Boolean isEnabled) {
        mProcessorEnabled = isEnabled;
    }

    public OffscreenEffectPlayer getEffectPlayer() {
        return mEffectPlayer;
    }

    private static class BuffersQueue implements BufferAllocator {

        private final int capacity;
        private final Queue<ByteBuffer> queue = new LinkedList<>();

        public BuffersQueue(int capacity) {
            this.capacity = capacity;
        }

        public BuffersQueue() {
            this(4);
        }

        @NonNull
        @Override
        public synchronized ByteBuffer allocateBuffer(int minimumCapacity) {

            final ByteBuffer buffer = queue.poll();
            if (buffer != null && buffer.capacity() >= minimumCapacity) {
                buffer.rewind();
                buffer.limit(buffer.capacity());
                return buffer;
            }

            return ByteBuffer.allocateDirect(minimumCapacity);
        }

        public synchronized void retainBuffer(@NonNull ByteBuffer buffer) {
            if (queue.size() < capacity) {
                queue.add(buffer);
            }
        }

    }

}
