import * as tensorflow from "@tensorflow/tfjs";

export const random = async (image: tensorflow.Tensor3D) => {
  const sample = tensorflow.randomUniform([1], 0.0, 1.0);

  const score = await sample.array();

  return (score as Array<number>)[0]
}
