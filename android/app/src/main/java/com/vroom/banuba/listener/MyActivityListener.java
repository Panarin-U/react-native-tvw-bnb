package com.vroom.banuba.listener;

import static com.vroom.banuba.utils.Constants.CAMERA_FRAME_HEIGHT;
import static com.vroom.banuba.utils.Constants.CAMERA_FRAME_RATE;
import static com.vroom.banuba.utils.Constants.CAMERA_FRAME_WIDTH;
import static com.vroom.banuba.utils.Constants.CAMERA_START_DELAY_MLS;

import android.os.Handler;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.vroom.banuba.utils.VideoCaptureUtils;
import com.vroom.banuba.video.processor.IVideoFrameProcessor;

import org.webrtc.Camera2Capturer;

public class MyActivityListener implements LifecycleEventListener {
    ReactApplicationContext context;
    private final IVideoFrameProcessor mVideoFrameProcessor;
    private final Camera2Capturer mCamera2Capturer;
    private final VideoCaptureUtils.CaptureInfo mCaptureInfo;

    public MyActivityListener(ReactApplicationContext context, Camera2Capturer mCamera2Capturer,
                              IVideoFrameProcessor mVideoFrameProcessor, VideoCaptureUtils.CaptureInfo mCaptureInfo){
        this.context = context;
        this.mVideoFrameProcessor = mVideoFrameProcessor;
        this.mCamera2Capturer = mCamera2Capturer;
        this.mCaptureInfo = mCaptureInfo;
    }

    @Override
    public void onHostResume() {
        new Handler().postDelayed(new Runnable() {
            public void run() {
                if(mCamera2Capturer != null && mVideoFrameProcessor!= null &&
                        mVideoFrameProcessor.getShouldCameraCapture()) {
                    mCamera2Capturer.startCapture(CAMERA_FRAME_WIDTH, CAMERA_FRAME_HEIGHT, CAMERA_FRAME_RATE);
                }
            }
        }, CAMERA_START_DELAY_MLS);
    }

    @Override
    public void onHostPause() {
        if(mCamera2Capturer != null && mVideoFrameProcessor!= null &&
                mVideoFrameProcessor.getShouldCameraCapture()){
            mCamera2Capturer.stopCapture();
        }
    }

    @Override
    public void onHostDestroy() {
        if(mCamera2Capturer != null){
            mCamera2Capturer.stopCapture();
            mVideoFrameProcessor.onCaptureDestroy();
            mVideoFrameProcessor.setShouldCameraCapture(false);;
        }
    }
}
