import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  GroupProvider,
  ListProvider,
  ReminderProvider,
} from "./src/context/index";
import { initGroup } from "./src/database/GroupDB";
import { initList } from "./src/database/ListDB";
import { initReminder } from "./src/database/ReminderDB";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { DetailList, Home, NewGroup, NewList, NewReminder } from "screens";
import DetailReminder from "screens/DetailReminder";
function AppContext({ children }) {
  return (
    <GroupProvider>
      <ListProvider>
        <ReminderProvider>{children}</ReminderProvider>
      </ListProvider>
    </GroupProvider>
  );
}

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const Stack = createNativeStackNavigator();

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 30,
            color: "black",
          }}
        >
          Error
        </Text>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <AppContext>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "#F2F2F7" },
            }}
          >
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="NewList"
              component={NewList}
              options={{
                presentation: "modal",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="NewGroup"
              component={NewGroup}
              options={{
                presentation: "modal",
                headerTitleAlign: "center",
              }}
            />

            <Stack.Screen
              name="NewReminder"
              component={NewReminder}
              options={{
                presentation: "modal",
                headerTitleAlign: "center",
              }}
            />

            <Stack.Screen
              name="DetailList"
              component={DetailList}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="DetailReminder"
              component={DetailReminder}
              options={{
                presentation: "modal",
                headerTitleAlign: "center",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
