import {View} from "react-native";
import {CircleViewStyleSheet} from "./CircleViewStyleSheet";
import {Text} from "react-native-ui-lib";
import React from "react";

export const CircleView = ({score}: { score: number }) => {
  return (
    <View style={CircleViewStyleSheet.view}>
      <Text style={CircleViewStyleSheet.text}>{Math.floor(score * 100)}</Text>
    </View>
  );
}
