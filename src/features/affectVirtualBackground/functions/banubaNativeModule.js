import { Platform, NativeModules } from "react-native";

const { VirtualBackgroundManager } = NativeModules;
const { VirtualBgManager } = NativeModules;

// export const isEnbleVrBg = (state) => {
//   const isIos = Platform.OS === 'ios'
//   if (isIos) {
//     const osVersion = parseInt(Platform.Version, 10)
//     const isOverVersiontarget = osVersion >= 13
//     const featureTrueConfig = enableFeature(state, 'background', true)
//     return isOverVersiontarget && featureTrueConfig
//   } else {
//     return false
//   }
// }

const isIos = Platform.OS === "ios";

export const startCameraVRBG = () => {
  isIos
    ? VirtualBackgroundManager.startCamera(0)
    : VirtualBgManager.startCamera();
};

export const stopCameraVRBG = () => {
  isIos
    ? VirtualBackgroundManager.stopCamera(0)
    : VirtualBgManager.stopCamera();
};

export const initVRCamera = (orientation) => {
  console.log("orientation ", orientation);
  return VirtualBackgroundManager.initCamera(orientation);
};

export const initAndroidVRCamera = (caller) => {
  VirtualBgManager.initCamera(caller);
};

export const selectBackground = (bg, optionalUri, isRotate) => {
  console.log("bg !!", bg);
  VirtualBgManager.selectBackground(bg || "None", optionalUri);
};

export const isSetupVirtualBackground = () => {
  return VirtualBackgroundManager.isSetup;
};
