import {Metric} from "../types/Metric";
import * as tensorflow from "@tensorflow/tfjs";

export const METRICS: Array<Metric> = [
  {
    id: "21274555-28fa-4bb3-9be3-443e2e5dbb8d",
    f: async (image: tensorflow.Tensor3D) => {
      const sample = tensorflow.randomUniform([1], 0.0, 1.0);

      const score = await sample.array();

      return (score as Array<number>)[0]
    },
  },
  {
    id: "34c6c9a5-747d-420d-9700-ce61a22b030a",
    f: async (image: tensorflow.Tensor3D) => 0.5,
  },
  {
    id: "03114c27-bf26-44ff-879c-ef4be677d09e",
    f: async (image: tensorflow.Tensor3D) => 0.5,
  }
]