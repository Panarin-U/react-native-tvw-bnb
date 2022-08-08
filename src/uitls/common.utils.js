import { Dimensions, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

let window = null;
export const getWindow = () => {
  if (!window) {
    window = Dimensions.get("window");
  }
  return window;
};

export const clearWindow = () => {
  window = null;
};
// An em() shortcut function referred from https://medium.com/@elieslama/responsive-design-in-react-native-876ea9cd72a8
// The Ultimate Guide To iPhone Resolutions from https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
export const em = (value) => {
  // Precalculate Device Dimensions for better performance
  const x = getWindow().width;

  // Calculating ratio from iPhone breakpoints
  const ratioX = x <= 375 ? (x <= 320 ? 0.75 : 0.875) : 1;

  // Base font size value
  const baseUnit = 16;

  // Simulating EM by changing font size according to Ratio
  const unit = baseUnit * ratioX;

  return unit * value;
};

export const isIOS = Platform.OS === "ios";

export const isTablet = DeviceInfo.isTablet() ? true : false;
