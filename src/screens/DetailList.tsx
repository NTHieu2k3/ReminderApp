import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RList from "components/Reminder/RList";
import { useListContext } from "context/list-context";
import { useReminderContext } from "context/reminder-context";
import { deleteList } from "database/ListDB";
import { updateReminder } from "database/ReminderDB";
import { NameType } from "enums/name-screen.enum";
import BottomBar from "layout/BottomBar";
import HeaderMenu from "layout/HeaderMenu";
import { List } from "models/List";
import { Reminder } from "models/Reminder";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RootStackParam } from "type/navigation.type";
import smartFilter from "utils/smartFilter";

export default function DetailList() {
  const [showCompleted, setShowCompleted] = useState(true);

  const [editId, setEditId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const route = useRoute();
  const { listId } = route.params as { listId: string };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  const listCtx = useListContext();
  const reminderCtx = useReminderContext();

  const STORAGE_KEY = `@showCompleted_${listId}`;

  const list: List | undefined = listCtx.lists.find(
    (item) => item.listId === listId
  );

  const allReminder = reminderCtx.reminders.filter((item) => item.status);
  const reminder: Reminder[] = smartFilter(allReminder, listId);

  async function setCompleted(id: string, completed: boolean) {
    const reminder = reminderCtx.reminders.find((item) => item.id === id);

    if (!reminder) return;

    const upd: Reminder = {
      ...reminder,
      status: completed ? 1 : 0,
    };

    await updateReminder(upd, id);
    reminderCtx.updateR(upd);
  }

  const updateShowCompleted = async (value: boolean) => {
    if (editMode && editId) return;
    try {
      setShowCompleted(value);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save showCompleted state", error);
    }
  };

  useEffect(() => {
    const loadShowCompleted = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setShowCompleted(JSON.parse(saved));
        }
      } catch (error: any) {
        Alert.alert("Warning", `Error: ${error.message}`);
      }
    };
    loadShowCompleted();
  }, []);

  async function deleteReminder() {
    try {
      await deleteList(listId);
      Alert.alert("Success", "Deleted Successfully !", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
      listCtx.deleteL(listId);
      return;
    } catch (error: any) {
      Alert.alert(
        "Warning",
        `Cannot Delete this List ! Error: ${error.message}`
      );
    }
  }

  async function done() {
    if (!editId) return;

    const reminder = reminderCtx.reminders.find((r) => r.id === editId);
    if (!reminder) return;

    const updated: Reminder = {
      ...reminder,
      title: editedTitle,
    };
    try {
      await updateReminder(updated, editId);
      reminderCtx.updateR(updated);
    } catch (error: any) {
      Alert.alert("Warning", `Error: ${error.message}`);
    }

    setEditMode(false);
    setEditId(null);
    setEditedTitle("");
  }

  const menu = useMemo(
    () => [
      {
        title: "Show List Info",
        icon: "pencil-outline" as const,
        onPress: () =>
          navigation.navigate(NameType.INFOLIST, { listId: listId }),
      },
      {
        title: "Show Completed",
        icon: "eye" as const,
        onPress: () => {
          updateShowCompleted(true);
        },
      },
      {
        title: "Delete List",
        icon: "trash" as const,
        onPress: () => {
          deleteReminder();
        },
      },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderMenu
        menuItems={menu}
        isEditMode={editMode}
        toggleEditMode={done}
        leftButton={() => navigation.goBack()}
      />

      {/* Content */}
      <ScrollView style={styles.scrollContainer}>
        <Text style={[styles.name, { color: list?.color }]}>
          {list?.name ?? "No name found"}
        </Text>
        <View style={styles.completeContainer}>
          <Text style={styles.completedText}>{reminder.length} Completed</Text>
          <Pressable
            style={({ pressed }) => [
              styles.clearContainer,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              updateShowCompleted(false);
            }}
          >
            <Ionicons
              name="ellipse-sharp"
              size={reminder.length > 0 ? 10 : 5}
              color={reminder.length > 0 ? "#6060ed" : "#77777a"}
            />
            <Text
              style={[
                styles.clearText,
                { color: reminder.length > 0 ? "#6060ed" : "#77777a" },
              ]}
            >
              Clear
            </Text>
          </Pressable>
        </View>
        <RList
          listId={listId}
          onToggleComplete={setCompleted}
          showCompleted={showCompleted}
          isEdit={editMode}
          editId={editId}
          onEdit={(id, title) => {
            setEditMode(true);
            setEditId(id);
            setEditedTitle(title);
          }}
        />
      </ScrollView>

      <BottomBar
        showLeftButton={true}
        colorText={list?.color}
        onLeftPress={() => {
          navigation.navigate(NameType.NEWREMINDER);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingTop: 40
  },

  scrollContainer: {
    height: "100%",
    marginBottom: 50,
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

  pressed: {
    opacity: 0.5,
  },
});
