HandLens
========

HandLens is a free and open-source Android and iOS application for measuring 
image features from your device’s camera. It was written to aid biologists 
in quickly evaluating assay diagnostics.

Adding a new assay to HandLens
------------------------------

Adding a new assay to HandLens is a simple three-step process:

1.  Add a new object to `src/assays.json`, e.g.

```json
{
    "id": "46d8394a-f094-41bb-b01d-f5cd23c8b165",
    "description": "A brief description of my assay",
    "name": "My example assay",
    "metric": "21274555-28fa-4bb3-9be3-443e2e5dbb8d"
}
```
    
*Use a website like the 
[Online UUID Generator](https://www.uuidgenerator.net) to generate new UUIDs 
for **id** and **metric**.*
    
2.  Create a new module for your assay in `src/metrics` with the structure:

```typescript
import * as tensorflow from "@tensorflow/tfjs";

export const example = async (image: tensorflow.Tensor3D): number => {
    return 1.0
}
```

The moudle name **must** correspond to the function name, e.g. 
`src/metrics/example.ts`.

3.  Add a new object to the `METRICS` array in the `src/metrics/index.ts` 
    module, e.g.

```typescript
export const METRICS: Array<Metric> = [
    {
      id: "21274555-28fa-4bb3-9be3-443e2e5dbb8d",
      f: example,
    }
]
```

***id** corresponds to the **metric** UUID added to `src/assays.json`.*

Writing a new HandLens metric
-----------------------------

HandLens metrics have the following signature:

```typescript
(image: tensorflow.Tensor3D) => Promise<number>
```

**image** is a basic TensorFlow.js tensor so writing new metrics should be an 
unexceptional process for anyone familiar with writing *n*-dimmensional array 
algorithms using software libraries like NumPy, PyTorch, or TensorFlow. The
[TensorFlow.js API](https://js.tensorflow.org/api/latest/) website outlines the 
operations provided by TensorFlow.js and, consequently, made available to 
HandLens

Here’s a simple example metric that outlines basic TensorFlow.js functionality:

```typescript
import * as tensorflow from "@tensorflow/tfjs";

/*
 *  returns the means intensity of an image
 */
export const meanIntensity = async (image: tensorflow.Tensor3D) => {
  return await tensorflow.mean(image).array();
}
```

Here’s a more complicated example that uses a convolutional neural network:

```typescript
import * as tensorflow from "@tensorflow/tfjs";

/*
 *  returns the probability the object is a beagle
 */

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
```
