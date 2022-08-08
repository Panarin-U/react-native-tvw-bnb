package com.vroom.banuba.video.processor;

import android.content.Context;
import android.os.Handler;

import org.webrtc.VideoFrame;

public interface IVideoFrameProcessor {
    void onCaptureCreate(Context context, Handler handler, int width, int height);

    void onCaptureStarted();

    void onCaptureStopped();

    void onCaptureDestroy();

    void pushVideoFrame(VideoFrame videoFrame, boolean isFrontCamera);
    void callJsMethod(String method, String param);
    void loadEffect(String effectName);
    void unloadEffect();
    void setProcessorEnabled(Boolean isEnabled);
    void applyBackground(String background, String uri);
    void setShouldCameraCapture(Boolean isEnabled);
    Boolean getShouldCameraCapture();
}
