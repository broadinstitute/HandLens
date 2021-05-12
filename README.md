HandLens
========

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
(image: tensorflow.Tensor3D) => tensorflow.Scalar
```

**image** is a basic TensorFlow.js tensor so writing new metrics should be a 
unexceptional process for anyone familiar with writing *n*-dimmensional array 
algorithms using software libraries like NumPy, PyTorch, or TensorFlow. The
[TensorFlow.js API](https://js.tensorflow.org/api/latest/) website outlines the 
operations provided by TensorFlow.js and, consequently, made available to 
HandLens

Here’s a simple example metric that outlines basic TensorFlow.js functionality:

```typescript
import * as tensorflow from "@tensorflow/tfjs";

export const meanIntensity = async (image: tensorflow.Tensor3D) => {
  return tensorflow.mean(image);
}
```
