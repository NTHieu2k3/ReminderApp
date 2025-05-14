import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RList from "components/Reminder/RList";
import { useListContext } from "context/list-context";
import BottomBar from "layout/BottomBar";
import HeaderMenu from "layout/HeaderMenu";
import { List } from "models/List";
import { useMemo } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type RootStackParam = {
  NewReminder: undefined;
};

export default function DetailList() {
  const route = useRoute();
  const { listId } = route.params as { listId: string };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  const listCtx = useListContext();

  const list: List | undefined = listCtx.lists.find(
    (item) => item.listId === listId
  );

  const menu = useMemo(
    () => [
      { title: "Show List Info", icon: "pencil-outline", onPress: () => {} },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderMenu menuItems={menu} leftButton={() => navigation.goBack()} />
      <ScrollView style={styles.scrollContainer}>
        <Text style={[styles.name, { color: list?.color }]}>
          {list?.name ?? "No name found"}
        </Text>
        <View style={styles.completeContainer}>
          <Text style={styles.completedText}>Completed</Text>
          <Pressable style={styles.clearContainer}>
            <Ionicons name="ellipse-sharp" size={5} color="#77777a" />
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        </View>
        <RList listId={listId} />
      </ScrollView>
      <BottomBar
        showLeftButton={true}
        colorText={list?.color}
        onLeftPress={() => {
          navigation.navigate("NewReminder");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContainer: {
    paddingBottom: 80,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  name: {
    fontSize: 50,
    fontWeight: 700,
  },

  completeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#d2d2d5",
    borderBottomWidth: 1,
    paddingBottom: 20,
  },

  clearContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },

  completedText: {
    color: "#77777a",
    fontSize: 18,
  },

  clearText: {
    color: "#afafb2",
    fontSize: 18,
    paddingLeft: 10,
  },
});
