import React, {useEffect, useState} from 'react';
import * as tensorflow from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {CameraScreen} from "../CameraScreen";
import {AssayListScreen} from "../AssayListScreen";

const Stack = createStackNavigator();

export const App = () => {
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
