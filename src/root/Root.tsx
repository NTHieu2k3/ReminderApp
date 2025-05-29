// src/Root.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { store } from "store/store";
import { Provider } from "react-redux";
import { initGroup } from "database/GroupDB";
import { initList } from "database/ListDB";
import { initReminder } from "database/ReminderDB";
import { StatusBar } from "expo-status-bar";
import {
  DetailList,
  Home,
  InfoList,
  NewGroup,
  NewList,
  NewReminder,
} from "screens";
import DetailReminder from "screens/DetailReminder";
import { NameType } from "enums/name-screen.enum";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { PaperProvider } from "react-native-paper";
import { ReminderNotificationHandler } from "utils";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Authen from "screens/Authen";

// Configure notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldSetBadge: false,
    shouldShowSound: false,
    shouldShowBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function Root() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function createDatabase() {
      try {
        await initGroup();
        await initList();
        await initReminder();
        setDbReady(true);
      } catch (error) {
        console.error("Error initializing databases:", error);
      }
    }
    createDatabase();
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Database...</Text>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <StatusBar style="auto" />
          <ReminderNotificationHandler />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: "#F2F2F7" },
              }}
            >
              <Stack.Screen
                name={NameType.AUTHEN}
                component={Authen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={NameType.HOME}
                component={Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={NameType.NEWLIST}
                component={NewList}
                options={{ presentation: "modal", headerTitleAlign: "center" }}
              />
              <Stack.Screen
                name={NameType.NEWGROUP}
                component={NewGroup}
                options={{ presentation: "modal", headerTitleAlign: "center" }}
              />
              <Stack.Screen
                name={NameType.NEWREMINDER}
                component={NewReminder}
                options={{ presentation: "modal", headerTitleAlign: "center" }}
              />
              <Stack.Screen
                name={NameType.DETAILLIST}
                component={DetailList}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={NameType.DETAILREMINDER}
                component={DetailReminder}
                options={{ presentation: "modal", headerTitleAlign: "center" }}
              />
              <Stack.Screen
                name={NameType.INFOLIST}
                component={InfoList}
                options={{ presentation: "modal", headerTitleAlign: "center" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    marginBottom: 12,
    color: "black",
  },
});
