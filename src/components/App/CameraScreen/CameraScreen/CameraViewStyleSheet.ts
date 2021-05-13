import {StyleSheet} from "react-native";

export const CameraViewStyleSheet = StyleSheet.create({
  camera: {
    ...StyleSheet.absoluteFillObject
  },
  view: {
    display: "flex",
    height: "100%",
    width: "100%",
    zIndex: 0
  }
});
