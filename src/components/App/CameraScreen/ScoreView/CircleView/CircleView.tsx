import {View} from "react-native";
import {CircleViewStyleSheet} from "./CircleViewStyleSheet";
import {Text} from "react-native-ui-lib";
import React from "react";
import {TouchableOpacity} from "react-native-ui-lib/core";

export const CircleView = ({score}: { score: number }) => {
  const onPress = () => {}

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={CircleViewStyleSheet.view}>
        <Text style={CircleViewStyleSheet.text}>{Math.floor(score * 100)}</Text>
      </View>
    </TouchableOpacity>
  );
}
