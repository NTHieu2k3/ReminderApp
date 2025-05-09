import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GroupProvider, ListProvider, ReminderProvider } from "context";
import { initGroup } from "database/GroupDB";
import { initList } from "database/ListDB";
import { initReminder } from "database/ReminderDB";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import Home from "screens/Home";
import NewGroup from "screens/NewGroup";
import NewList from "screens/NewList";

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
  const Stack = createNativeStackNavigator();
  useEffect(() => {
    async function createDatabase() {
      try {
        await initGroup();
        await initList();
        await initReminder();
      } catch (error) {
        console.error("Error initializing databases:", error);
      }
    }
    createDatabase();
  }, []);

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
              }}
            />
            <Stack.Screen
              name="NewList"
              component={NewList}
              options={{
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="NewGroup"
              component={NewGroup}
              options={{
                presentation: "modal",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  abc: {
    backgroundColor: "#0770e1",
  },
});
