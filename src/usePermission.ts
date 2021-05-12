import {useCallback, useEffect, useState} from "react";
import {Camera} from "expo-camera";

export const usePermission = () => {
  const [permission, setPermission] = useState<boolean | null>(null);

  const f = useCallback(async () => {
    const {status} = await Camera.requestPermissionsAsync();

    setPermission(status === "granted");
  }, [])

  useEffect(() => {
    f()
      .catch((error) => {
        console.info(error)
      });
  }, []);

  return permission;
}
