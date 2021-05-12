import {View} from "react-native";
import {ScoreViewStyleSheet} from "./ScoreViewStyleSheet";
import {CircleView} from "../CircleView";
import React from "react";

export const ScoreView = ({score}: { score: number }) => {
  return (
    <View style={ScoreViewStyleSheet.view}>
      <CircleView score={score}/>
    </View>
  )
}
