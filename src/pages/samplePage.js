import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  requestMultiple,
} from "react-native-permissions";

import {
  RTCView,
  MediaStream,
  mediaDevices,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";

import SplashScreen from "react-native-splash-screen";

import { useSelector, useDispatch } from "react-redux";

import _ from "lodash";

import {
  initVRCamera,
  initAndroidVRCamera,
  startCameraVRBG,
  stopCameraVRBG,
  setInitVirtualBackgroundAction,
  selectBackground,
} from "../features/affectVirtualBackground";

import { useNavigation } from "@react-navigation/native";

const SamplePage = (props) => {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const [localStream, setLocalStream] = useState(null);
  const [permissionAudio, setPermissionAudio] = useState(false);
  const [audio, setAudio] = useState(true);
  const [permissionVideo, setPermissionVideo] = useState(false);
  const [video, setVideo] = useState(true);

  const isInitVirtualBackground = useSelector((state) =>
    _.get(state, "virtualBackground.initVirtualBackground", false)
  );

  useEffect(() => {
    SplashScreen.hide();
  });

  const getMediaStream = async () => {
    console.log("Platform");
    try {
      const devicePermissionMic = Platform.select({
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      });
      const devicePermissionCam = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      });

      requestMultiple([devicePermissionMic, devicePermissionCam])
        .then((statuses) => {
          console.log("success");
          setStream(statuses, devicePermissionMic, devicePermissionCam);
        })
        .catch((e) => console.error(e));
    } catch (error) {
      const stream = new MediaStream();
      setLocalStream(stream);
      console.log("[PrejoinComponent][getMediaStream][error]: ", error);
    }
  };

  const initBanubaVirtualBackground = useCallback(() => {
    console.log("[Virtual Background] initVRCamera");
    initAndroidVRCamera((success) => {
      if (success) {
        dispatch(setInitVirtualBackgroundAction());
        startCameraVRBG();
      }
    });
  }, [video]);

  const setStream = async (
    statuses,
    devicePermissionMic,
    devicePermissionCam
  ) => {
    try {
      let permissionMic = statuses[devicePermissionMic] == "granted";
      let permissionCam = statuses[devicePermissionCam] == "granted";
      const info = {
        audio: permissionMic,
        video: permissionCam,
        vb: true,
      };

      const stream = await mediaDevices.getUserMedia(info);
      // const videoTrack = stream.getVideoTracks()[0]
      // const audioTrack = stream.getAudioTracks()[0]
      setPermissionAudio(permissionMic);
      setPermissionVideo(permissionCam);
      setVideo(permissionCam);
      setAudio(permissionMic);
      setLocalStream(stream);
      if (
        statuses[PERMISSIONS.IOS.CAMERA] === "granted" &&
        !isInitVirtualBackground
      ) {
        initBanubaVirtualBackground();
      } else if (
        statuses[PERMISSIONS.ANDROID.CAMERA] === "granted" &&
        !isInitVirtualBackground
      ) {
        initBanubaVirtualBackground();
      } else if (Platform.OS === "android") {
        startAndroidCamera();
      } else {
        startCameraVRBG();
      }

      navigation.navigate("AffectVirtualBackgroundPage", {
        stream: stream,
      });
    } catch (error) {
      console.error(error);
      const stream = new MediaStream();
      setLocalStream(stream);
      setAudio(false);
      setVideo(false);
    }
  };

  const startAndroidCamera = () => {
    initAndroidVRCamera((status) => {
      console.log("status ", status);
      if (status) {
        startCameraVRBG();
      }
    });
  };

  const onPress = () => {};

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={() => getMediaStream()}>
        <Text> select background</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SamplePage;
