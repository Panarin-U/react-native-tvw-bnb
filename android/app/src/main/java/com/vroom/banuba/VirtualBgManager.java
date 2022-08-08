package com.vroom.banuba;

import static com.vroom.banuba.utils.Constants.CAMERA_FRAME_HEIGHT;
import static com.vroom.banuba.utils.Constants.CAMERA_FRAME_RATE;
import static com.vroom.banuba.utils.Constants.CAMERA_FRAME_WIDTH;
import static com.vroom.banuba.utils.Constants.CAMERA_START_DELAY_MLS;

import android.annotation.SuppressLint;
import android.os.Handler;

import androidx.annotation.NonNull;

import com.banuba.sdk.internal.utils.OrientationHelper;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.oney.WebRTCModule.GetUserMediaImpl;
import com.vroom.banuba.listener.MyActivityListener;
import com.vroom.banuba.utils.VideoCaptureUtils;
import com.vroom.banuba.video.CameraEventsHandler;
import com.vroom.banuba.video.CaptureFrame;
import com.vroom.banuba.video.processor.BanubaProcessor;
import com.vroom.banuba.video.processor.IVideoFrameProcessor;

import org.webrtc.Camera2Capturer;
import org.webrtc.Camera2Enumerator;
import org.webrtc.CameraEnumerator;
import org.webrtc.CapturerObserver;
import org.webrtc.VideoFrame;

public class VirtualBgManager extends ReactContextBaseJavaModule {
    ReactApplicationContext context;
    public VirtualBgManager(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }
    private final boolean isUseFront = true;
    private VideoCaptureUtils.CaptureInfo mCaptureInfo;
    private Camera2Capturer mCamera2Capturer;
    private IVideoFrameProcessor mVideoFrameProcessor;

    @SuppressLint("RestrictedApi")
    @ReactMethod
    public void initCamera(Callback callback) {
        try {
            if(mCamera2Capturer != null) {
                callback.invoke(true);
                return;
            }
            OrientationHelper.getInstance(context).startDeviceOrientationUpdates();
            CameraEnumerator enumerator = new Camera2Enumerator(context);
            mCaptureInfo = VideoCaptureUtils.getCaptureInformation(enumerator, CaptureFrame.PRESET640X480);
            mCamera2Capturer = new Camera2Capturer(context,mCaptureInfo.deviceName, new CameraEventsHandler());
            mVideoFrameProcessor = new BanubaProcessor();
            context.addLifecycleEventListener(new MyActivityListener(context,mCamera2Capturer,mVideoFrameProcessor,mCaptureInfo));
            mCamera2Capturer.initialize(GetUserMediaImpl.surfaceTextureHelper, context, new CapturerObserver() {

                @Override
                public void onCapturerStarted(boolean b) {
                    mVideoFrameProcessor.onCaptureStarted();
                }

                @Override
                public void onCapturerStopped() {
                    mVideoFrameProcessor.onCaptureStopped();
                }

                @Override
                public void onFrameCaptured(VideoFrame videoFrame) {
                    mVideoFrameProcessor.pushVideoFrame(videoFrame, isUseFront);
                }
            });
            mVideoFrameProcessor.onCaptureCreate(context, GetUserMediaImpl.surfaceTextureHelper.getHandler(), CAMERA_FRAME_WIDTH, CAMERA_FRAME_HEIGHT);
            callback.invoke(true);
        }catch (Exception e){callback.invoke(false);}
    }

    @ReactMethod
    public void startCamera() {
        new Handler().postDelayed(new Runnable() {
            public void run() {
                mCamera2Capturer.startCapture(CAMERA_FRAME_WIDTH, CAMERA_FRAME_HEIGHT, CAMERA_FRAME_RATE);
                mVideoFrameProcessor.setShouldCameraCapture(true);
            }
        }, CAMERA_START_DELAY_MLS);
    }

    @ReactMethod
    public void stopCamera() {
        if(mCamera2Capturer != null) {
            mCamera2Capturer.stopCapture();
            mVideoFrameProcessor.setShouldCameraCapture(false);
        }
    }

    @ReactMethod
    public void onDestroy() {
        mVideoFrameProcessor.onCaptureDestroy();
        mVideoFrameProcessor.setShouldCameraCapture(false);
    }

    @ReactMethod
    public void selectBackground(String background, String uri){
        mVideoFrameProcessor.applyBackground(background,uri);
    }

    @NonNull
    @Override
    public String getName() {
        return "VirtualBgManager";
    }
}

