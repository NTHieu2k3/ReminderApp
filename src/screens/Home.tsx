import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useListContext } from "../context/list-context";
import { deleteList, getAllLists } from "../database/ListDB";
import BottomBar from "../layout/BottomBar";
import HeaderMenu from "../layout/HeaderMenu";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { LList } from "components/List";
import { useGroupContext } from "context/group-context";
import { GList } from "components/Group";
import { deleteGroup, getAllGroups } from "database/GroupDB";
import { getAllReminders } from "database/ReminderDB";
import { useReminderContext } from "context/reminder-context";

type RootStackParam = {
  Home: undefined;
  NewList: undefined;
  NewGroup: undefined;
  NewReminder: undefined;
  DetailList: { listId: string };
};

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  const { groups, deleteG, setG } = useGroupContext();
  const { lists, deleteL, setL } = useListContext();
  const { reminders, setR } = useReminderContext();

  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditPress = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const menuItems = useMemo(
    () => [
      {
        title: "Edit",
        icon: "pencil-outline" as const,
        onPress: () => setIsEditMode(true),
      },
    ],
    [handleEditPress]
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function fetch() {
        try {
          const dataG = await getAllGroups();
          const dataL = await getAllLists();
          const dataR = await getAllReminders();
          if (isActive) {
            setG(dataG);
            setL(dataL);
            setR(dataR);
          }
        } catch (error: any) {
          if (isActive) Alert.alert("Warning", `${error}`);
          console.log(error);
        }
      }
      fetch();
      return () => {
        isActive = false;
      };
    }, [setL, setG])
  );

  const DeleteListHandle = useCallback(
    async (listId: string) => {
      try {
        await deleteList(listId);
        deleteL(listId);
      } catch (error: any) {
        Alert.alert("Warning", `${error.message}`);
      }
    },
    [deleteL]
  );

  const DeleteGroupHandle = useCallback(
    async (groupId: string) => {
      try {
        await deleteGroup(groupId);
        deleteG(groupId);
      } catch (error: any) {
        Alert.alert("Warning", `${error.message}`);
      }
    },
    [deleteG]
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderMenu
        menuItems={menuItems}
        isEditMode={isEditMode}
        toggleEditMode={() => setIsEditMode(false)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#8E8E93"
            style={{ marginLeft: 8 }}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#8E8E93"
            style={styles.searchInput}
          />
          <Ionicons
            name="mic"
            size={18}
            color="#8E8E93"
            style={{ marginRight: 8 }}
          />
        </View>
        <LList
          lists={lists}
          reminder={reminders}
          isEditMode={isEditMode}
          onDelete={(item) => DeleteListHandle(item.listId)}
          onPressItem={(item) => {
            navigation.navigate("DetailList", { listId: item.listId });
          }}
        />
        <GList
          groups={groups}
          lists={lists}
          reminders={reminders}
          isEditMode={isEditMode}
          onDelete={(item) => DeleteGroupHandle(item.groupId)}
          onPressItem={(l) =>
            navigation.navigate("DetailList", { listId: l.listId })
          }
          onDeleteItem={(item) => DeleteListHandle(item.listId)}
        />
      </ScrollView>
      <BottomBar
        showLeftButton={true}
        showRightButton={true}
        isEditMode={isEditMode}
        onLeftPress={() => {
          if (isEditMode) {
            navigation.navigate("NewGroup");
          } else {
            navigation.navigate("NewReminder");
          }
        }}
        onRightPress={() => {
          navigation.navigate("NewList");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingTop: 24,
  },

  scrollContent: {
    paddingBottom: 80,
    paddingHorizontal: 16,
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1D1D6",
    borderRadius: 12,
    height: 36,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    marginHorizontal: 8,
  },
});
