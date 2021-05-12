import {useCallback, useEffect, useState} from "react";
import * as tensorflow from "@tensorflow/tfjs";
import {Metric} from "./Metric";
import * as _ from "lodash";


export const useScore = (image?: tensorflow.Tensor3D, metric?: Metric) => {
  const [score, setScore] = useState<number>(0.0);

  const f = useCallback(async () => {
    if (!image || !metric) return;

    const y = await metric.f(image);

    setScore(y);
  }, [image, metric]);

  useEffect(() => {
    const debounced = _.debounce(f, 1000);

    debounced();

    return () => debounced.cancel();
  });

  return score;
}
