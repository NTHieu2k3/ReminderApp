import {
  launchImageLibraryAsync,
  PermissionStatus,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import { Alert, Linking } from "react-native";

export default function usePhotoLibrary(): () => Promise<string | null> {
  const [cameraPermission, requestPermission] = useMediaLibraryPermissions();

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
            "You need to grant camera permissions to select image.",
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

  return async function pickedImageHandler(): Promise<string | null> {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return null;

    const image = await launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.5,
    });

    if (!image.canceled && image.assets.length > 0) {
      return image.assets[0].uri;
    }
    return null;
  };
}
