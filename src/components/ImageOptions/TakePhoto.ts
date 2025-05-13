import {
  launchCameraAsync,
  PermissionStatus,
  useCameraPermissions,
} from "expo-image-picker";
import { Alert, Linking } from "react-native";

export default function useTakePhoto(): () => Promise<string | null> {
  const [cameraPermission, requestPermission] = useCameraPermissions();

  async function verifyPermissions() {
    try {
      if (!cameraPermission) {
        return false;
      }

      if (cameraPermission.status == PermissionStatus.UNDETERMINED) {
        const permissionRespone = await requestPermission();
        return permissionRespone.granted;
      }

      if (cameraPermission.status == PermissionStatus.DENIED) {
        const permissionRespone = await requestPermission();
        if (!permissionRespone.granted) {
          Alert.alert(
            "Insufficient Permission !",
            "You need to grant camera permissions to use this app.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ]
          );
          return false;
        }
      }
      return true;
    } catch (error: any) {
      Alert.alert("Warning", `Error: ${error.message}`);
      return false;
    }
  }

  return async function takePhotoHandler(): Promise<string | null> {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return null;

    const result = await launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      return result.assets[0].uri;
    }

    return null;
  };
}
