import React, {useEffect, useState} from "react";
import {Assay} from "../../../../types/Assay";
import {Metric} from "../../../../types/Metric";
import {useImage} from "../../../../hooks/useImage";
import {useNavigation, useRoute} from "@react-navigation/native";
import {usePermission} from "../../../../hooks/usePermission";
import {useScore} from "../../../../hooks/useScore";
import * as _ from "lodash";
import {View} from "react-native";
import {CameraViewStyleSheet} from "./CameraViewStyleSheet";
import {TensorCamera} from "../TensorCamera";
import {Camera} from "expo-camera";
import {ScoreView} from "../ScoreView";
import {METRICS} from "../../../../metrics";

export const CameraScreen = () => {
  const [assay, setAssay] = useState<Assay>();
  const [metric, setMetric] = useState<Metric>();

  const {image, onReady} = useImage();

  const navigation = useNavigation();

  const permission = usePermission();

  const route = useRoute();

  const score = useScore(image, metric);

  useEffect(() => {
    setAssay(route.params as Assay);

    if (!assay) return;

    const options = {title: assay.name};

    navigation.setOptions(options);

    setMetric(_.find(METRICS, (metric: Metric) => metric.id === assay.metric));
  });

  if (!permission) return <View/>

  return (
    <View style={CameraViewStyleSheet.view}>
      <TensorCamera
        autorender
        cameraTextureHeight={1920}
        cameraTextureWidth={1080}
        onReady={onReady}
        resizeDepth={3}
        resizeHeight={224}
        resizeWidth={224}
        style={CameraViewStyleSheet.camera}
        type={Camera.Constants.Type.back}
      />
      <ScoreView score={score}/>
    </View>
  )
}
