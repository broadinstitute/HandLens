import * as tensorflow from "@tensorflow/tfjs";

export type Metric = {
  id: string;
  f: (image: tensorflow.Tensor3D) => Promise<number>
};
