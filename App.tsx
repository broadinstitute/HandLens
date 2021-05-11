import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import * as tensorflow from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import {cameraWithTensors} from "@tensorflow/tfjs-react-native";
import {Camera} from "expo-camera";
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, useNavigation, useRoute} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import {Colors, ListItem, Text} from 'react-native-ui-lib';
import * as _ from "lodash";

type Assay = {
  id: string;
  name: string;
  description: string;
  metric: string;
}

type Metric = {
  id: string;
  f: (image: tensorflow.Tensor3D) => Promise<number>
};

const ASSAYS: Array<Assay> = [
  {
    id: "46d8394a-f094-41bb-b01d-f5cd23c8b165",
    description: "Nullam semper vitae libero suscipit ornare.",
    name: "Integer viverra",
    metric: "21274555-28fa-4bb3-9be3-443e2e5dbb8d"
  },
  {
    id: "6009a0d9-9d75-43ce-8d92-de2da55fc3f7",
    description: "Curabitur velit odio, auctor quis eleifend ut, suscipit id odio.",
    name: "Viverra",
    metric: "34c6c9a5-747d-420d-9700-ce61a22b030a"
  },
  {
    id: "41e2c106-c8e5-4f6a-aa7b-612e8dac233a",
    description: "Suspendisse mattis aliquam lectus.",
    name: "Etiam viverra",
    metric: "03114c27-bf26-44ff-879c-ef4be677d09e"
  }
]

const METRICS: Array<Metric> = [
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

const Stack = createStackNavigator();

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
const TensorCamera = cameraWithTensors(Camera);

const AssayListScreenStyleSheet = StyleSheet.create({
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.dark70,
  },
  part: {
    paddingLeft: 32
  },
});

const AssayListScreen = () => {
  const navigation = useNavigation();

  const onPress = (assay: Assay) => {
    navigation.navigate("Camera", assay);
  }

  const renderItem = ({ item }: { item: Assay }) => {
    return (
      <Animatable.View>
        <ListItem containerStyle={[AssayListScreenStyleSheet.border]} onPress={() => onPress(item)}>
          <ListItem.Part containerStyle={[AssayListScreenStyleSheet.part]}>
            <Text>{item.name}</Text>
          </ListItem.Part>
        </ListItem>
      </Animatable.View>
    )
  }

  return (
    <FlatList
      data={ASSAYS}
      keyExtractor={(item: Assay) => item.id}
      renderItem={renderItem}
    />
  );
}

const CameraViewStyleSheet = StyleSheet.create({
  camera: {
    flex: 1,
  },
  view: {
    display: "flex",
    height: "100%",
    width: "100%",
    zIndex: 0
  }
});

const CircleViewStyleSheet = StyleSheet.create({
  view: {
    backgroundColor: "red",
    borderRadius: 64 / 2,
    height: 64,
    width: 64,
  }
});

const ScoreViewStyleSheet = StyleSheet.create({
  view: {
    alignItems: "center",
    bottom: 0,
    flex: 1,
    justifyContent: "flex-end",
    margin: 64,
    zIndex: 100
  }
});

const CircleView = () => {
  return <View style={CircleViewStyleSheet.view} />;
}

const ScoreView = () => {
  return (
    <View style={ScoreViewStyleSheet.view}>
      <CircleView/>
    </View>
  )
}

const useImage = () => {
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

  return { image, onReady };
}

const usePermission = () => {
  const [permission, setPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const effect = async () => {
      const {status} = await Camera.requestPermissionsAsync();

      setPermission(status === "granted");
    }

    effect()
      .catch((error) => {
        console.error(error)
      });
  }, []);

  return permission;
}

const useScore = (image?: tensorflow.Tensor3D, metric?: Metric) => {
  const [score, setScore] = useState<number>(0.0);

  const f = useCallback(async () => {
    if (!image || !metric) return;

    const y = await metric.f(image);

    setScore(y);
  }, [image, metric]);

  useEffect(() => {
    const debounced = _.debounce(f, 1000 / 60);

    debounced();

    return () => debounced.cancel();
  });

  return score;
}

const CameraScreen = () => {
  const [assay, setAssay] = useState<Assay>();
  const [metric, setMetric] = useState<Metric>();

  const { image, onReady } = useImage();

  const navigation = useNavigation();

  const permission = usePermission();

  const route = useRoute();

  const score = useScore(image, metric);

  useEffect(() => {
    setAssay(route.params as Assay);

    if (!assay) return;

    const options = { title: assay.name };

    navigation.setOptions(options);

    setMetric(_.find(METRICS, (metric: Metric) => metric.id === assay.metric));
  });

  if (!permission) return <View/>

  return (
    <View style={CameraViewStyleSheet.view}>
      <TensorCamera
        autorender
        cameraTextureHeight={1920}
        cameraTextureWidth={1080}
        onReady={onReady}
        resizeDepth={3}
        resizeHeight={224}
        resizeWidth={224}
        style={CameraViewStyleSheet.camera}
        type={Camera.Constants.Type.back}
      />
      <Text>{`Score: ${Math.floor(score * 100)}%`}</Text>
      <ScoreView/>
    </View>
  )
}

export default () => {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    const effect = async () => {
      await tensorflow.ready();

      setReady(true);
    }

    effect();
  })

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Assays" component={AssayListScreen} />
        <Stack.Screen name="Camera" component={CameraScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
