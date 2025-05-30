import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NameType } from "enums/name-screen.enum";
import { List } from "models/List";
import { Reminder } from "models/Reminder";
import { useEffect, useMemo, useState } from "react";
import { RootStackParam } from "type/navigation.type";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  deleteReminderThunk,
  updateReminderThunk,
} from "store/actions/reminderActions";
import { deleteListThunk } from "store/actions/listActions";
import HeaderMenu from "layout/HeaderMenu";
import BottomBar from "layout/BottomBar";
import RList from "components/Reminder/RList";
import smartFilter from "utils/smartFilter";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailList() {
  const [showCompleted, setShowCompleted] = useState(true);

  const [hiddenCompleted, setHiddenCompleted] = useState<string[]>([]);

  const [editId, setEditId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const route = useRoute();
  const { listId } = route.params as { listId: string };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  const dispatch = useAppDispatch();
  const lists = useAppSelector((state) => state.list.lists);
  const reminders = useAppSelector((state) => state.reminder.reminders);

  const list: List | undefined = lists.find((item) => item.listId === listId);

  const reminder: Reminder[] = useMemo(
    () => smartFilter(reminders, listId),
    [reminders]
  );

  const allR: string[] = useMemo(
    () => reminder.filter((item) => item.status === 1).map((item) => item.id),
    [reminder]
  );

  async function setCompleted(id: string, completed: boolean) {
    const reminder = reminders.find((item) => item.id === id);

    if (!reminder) return;

    const upd: Reminder = {
      ...reminder,
      status: completed ? 1 : 0,
    };

    await dispatch(updateReminderThunk(upd));
  }

  useEffect(() => {
    const saveState = async () => {
      await AsyncStorage.setItem("showCompleted", showCompleted.toString());
    };

    saveState();
  }, [showCompleted]);

  useEffect(() => {
    const getState = async () => {
      const state = await AsyncStorage.getItem("showCompleted");

      if (state !== null) {
        setShowCompleted(state === "true");
      }
    };

    getState();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiddenCompleted((prev) => {
        const newItems = allR.filter((item) => !prev.includes(item));

        if (newItems.length > 0) {
          return [...prev, ...newItems];
        }
        return prev;
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [reminder]);

  useEffect(() => {
    setHiddenCompleted((prev) => prev.filter((item) => allR.includes(item)));
  }, [allR]);

  useEffect(() => {
    console.log(hiddenCompleted);
  }, [hiddenCompleted]);

  const filteredReminder = useMemo(() => {
    if (showCompleted) {
      return reminder;
    } else if (!showCompleted) {
      return reminder.filter((r) => !hiddenCompleted.includes(r.id));
    }
  }, [showCompleted, reminder, hiddenCompleted]);

  async function clearReminder() {
    const completedR = reminders.filter((item) => item.status === 1);

    for (const item of completedR) {
      await dispatch(deleteReminderThunk(item.id));
    }
  }

  async function deleteReminder() {
    try {
      await dispatch(deleteListThunk(listId));
      Alert.alert("Success", "Deleted Successfully !", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
      return;
    } catch (error: any) {
      Alert.alert(
        "Warning",
        `Cannot Delete this List ! Error: ${error.message}`
      );
    }
  }

  function done() {
    if (!editId) return;

    const reminder = reminders.find((r) => r.id === editId);
    if (!reminder) return;

    const updated: Reminder = {
      ...reminder,
      title: editedTitle,
    };
    try {
      dispatch(updateReminderThunk(updated));
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
        title: showCompleted === true ? "Hide Completed" : "Show Completed",
        icon: showCompleted === true ? "eye-off" : ("eye" as const),
        onPress: () => setShowCompleted((prev) => !prev),
      },
      {
        title: "Delete List",
        icon: "trash" as const,
        onPress: () => {
          deleteReminder();
        },
      },
    ],
    [navigation, listId, showCompleted]
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
        {showCompleted && (
          <View style={styles.completeContainer}>
            <Text style={styles.completedText}>{allR.length} Completed</Text>
            <Pressable
              style={({ pressed }) => [
                styles.clearContainer,
                pressed && styles.pressed,
              ]}
              onPress={clearReminder}
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
        )}
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
          reminders={filteredReminder ?? []}
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
    paddingTop: 40,
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
