HandLens
========

Adding new assays to HandLens
-----------------------------

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
    
2.  Create a new module for your assay in the `src/metrics` directory. Your 
    module **must** use the following structure:

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