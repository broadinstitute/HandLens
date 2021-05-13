import * as tensorflow from "@tensorflow/tfjs";

const SHAPE = [1, 224, 224, 3];

const ORIGIN = "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/3/default/1";

export const classifier = async (image: tensorflow.Tensor3D) => {
  const graph = await tensorflow.loadGraphModel(ORIGIN, {fromTFHub: true});

  const prediction = tensorflow.tidy(() => {
    const preprocessed = image.sub(255 / 2).div(255 / 2).reshape(SHAPE);

    const prediction = graph.predict(preprocessed) as tensorflow.Tensor;

    return prediction.flatten();
  });

  return (await prediction.array())[162]
}
