import {cameraWithTensors} from "@tensorflow/tfjs-react-native";
import {Camera} from "expo-camera";

/*
 * `cameraWithTensors` creates an instance of Expo’s Camera class where the
 * `onReady` callback yields TensorFlow.js tensors rather than the data
 * structures usually yielded by Android or iOS.
 *
 * This function is what enables HandLens simplicity. HandLens isn’t much more
 * complicated than loading an assay-specific `onReady` implementation for the
 * selected assay. It’s also what enables HandLens extensibility. Adding a new
 * assay is as basic as writing a new `onReady` implementation.
 *
 * Because it’s so critical to HandLen’s architecture, it’s worth pausing and
 * noting the signature of `onReady` provided by `cameraWithTensors`:
 *
 *      onReady: (
 *          images: IterableIterator<tensorflow.Tensor3D>,
 *          updateCameraPreview: () => void,
 *          gl: ExpoWebGLRenderingContext
 *      ) => void
 *
 * Since we’ll use the `autorender` property to automatically update the
 * camera’s buffer, both `updateCameraPreview` and `gl` can be ignored.
 *
 * `images` is, thankfully, as simple as it looks. It’s an iterator that yields
 * three-dimensional tensors (i.e. Tensor3D) with the shape
 * `(width, height, depth)`. `depth` will always be 3 (RGB) or 4 (RGBA).
 *
 * For extensibility reasons, HandLens provides `process`, a wrapper around
 * `onReady`, with the following signature:
 *
 *      process: (image: tensorflow.Tensor3D) => void
 *
 * The `process` function is used so users comfortable writing *n*-d array
 * functions (e.g. using NumPy, PyTorch, TensorFlow, etc.) won’t need to think
 * about any HandLens-specific details like JavaScript iterators or WebGL
 * contexts.
 */
export const TensorCamera = cameraWithTensors(Camera);
