package com.vroom.banuba.video;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import org.webrtc.CameraVideoCapturer;

public class CameraEventsHandler implements CameraVideoCapturer.CameraEventsHandler, CameraVideoCapturer.CameraSwitchHandler {
    private static final String TAG = "Camera";
    private boolean isFrontCamera;
    private Handler mainHandler = new Handler(Looper.getMainLooper());


    @Override
    public void onCameraError(String s) {
        Log.v(TAG, "onCameraError = "+s);
    }

    @Override
    public void onCameraDisconnected() {
        Log.v(TAG, "onCameraDisconnected = ");
    }

    @Override
    public void onCameraFreezed(String s) {
        Log.v(TAG, "onCameraFreezed = "+s);
    }

    @Override
    public void onCameraOpening(String s) {
        Log.v(TAG, "onCameraOpening = "+s);
    }

    @Override
    public void onFirstFrameAvailable() {
        Log.v(TAG, "onFirstFrameAvailable = ");
    }

    @Override
    public void onCameraClosed() {
        Log.v(TAG, "onCameraClosed = ");
    }

    @Override
    public void onCameraSwitchDone(boolean b) {
        isFrontCamera = b;
//        mainHandler.post(() ->{
//            if (mCallback != null){
//                mCallback.onCameraSwitchDone(isFrontCamera);
//            }
//        });
    }

    @Override
    public void onCameraSwitchError(String s) {
//        mainHandler.post(() ->{
//            if (mCallback != null){
//                mCallback.onCameraSwitchError(s);
//            }
//        });
    }
}
