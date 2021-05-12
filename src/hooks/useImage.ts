import {useEffect, useState} from "react";
import * as tensorflow from "@tensorflow/tfjs";

export const useImage = () => {
  const [image, setImage] = useState<tensorflow.Tensor3D>();
  const [images, setImages] = useState<IterableIterator<tensorflow.Tensor3D>>();

  useEffect(() => {
    if (!images) return;

    const effect = async () => {
      const image = await images.next().value;

      setImage(image);
    }

    effect()
      .catch((error) => {
        console.error(error)
      });
  }, [images]);

  const onReady = (images: IterableIterator<tensorflow.Tensor3D>) => {
    setImages(images);
  };

  return {image, onReady};
}
