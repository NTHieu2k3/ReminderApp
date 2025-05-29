import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

interface PushNotificationState {
  notification?: Notifications.Notification | null;
  expoPushToken: string | undefined;
}

export const usePushNotification = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(
    undefined
  );

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      console.log("Existing notification permission status:", existingStatus);
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("Requested notification permission:", finalStatus);
      }

      if (finalStatus !== "granted") {
        Alert.alert("Warning", "Failed to get push token !");
      }

      try {
        const tokenObject = await Notifications.getExpoPushTokenAsync();
        token = tokenObject.data; // lấy chuỗi token
      } catch (error) {
        console.error("Error getting Expo push token:", error);
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#ff231f7c",
        });
      }
      return token;
    } else {
      console.log("ERROR: Please use a physical device");
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
