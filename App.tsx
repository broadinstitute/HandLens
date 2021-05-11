import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import * as tensorflow from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import {cameraWithTensors} from "@tensorflow/tfjs-react-native";
import {Camera} from "expo-camera";
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, useNavigation, useRoute} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import {Colors, ListItem, Text} from 'react-native-ui-lib';

type Assay = {
  description: string;
  id: string;
  name: string;
}

const ASSAYS: Array<Assay> = [
  {
    id: "46d8394a-f094-41bb-b01d-f5cd23c8b165",
    description: "Nullam semper vitae libero suscipit ornare.",
    name: "Integer viverra"
  },
  {
    id: "6009a0d9-9d75-43ce-8d92-de2da55fc3f7",
    description: "Curabitur velit odio, auctor quis eleifend ut, suscipit id odio.",
    name: "Viverra"
  },
  {
    id: "41e2c106-c8e5-4f6a-aa7b-612e8dac233a",
    description: "Suspendisse mattis aliquam lectus.",
    name: "Etiam viverra"
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

const CameraScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();

  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    const effect = async () => {
      const {status} = await Camera.requestPermissionsAsync();

      setPermissionGranted(status === "granted");
    }

    effect();
  }, []);

  useEffect(() => {
    const options = { title: (route.params as Assay).name };

    navigation.setOptions(options)
  })

  if (!permissionGranted) return <View/>

  const onReady = (images: IterableIterator<tensorflow.Tensor3D>) => {};

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
        type={type}
      />
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

