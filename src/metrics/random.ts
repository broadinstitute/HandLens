import * as tensorflow from "@tensorflow/tfjs";

export const random = async (image: tensorflow.Tensor3D): Promise<number> => {
  const sample = tensorflow.randomUniform([], 0.0, 1.0);

  return 1.0;
}
