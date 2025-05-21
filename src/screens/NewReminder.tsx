import { useNavigation } from "@react-navigation/native";
import RForm from "components/Reminder/RForm";
import { StatusBar } from "expo-status-bar";
import { useReminderForm } from "hooks";
import { useCallback, useLayoutEffect } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { createReminderThunk } from "store/actions/reminderActions";
import { useAppDispatch, useAppSelector } from "store/hooks";
import scheduleReminderNotification from "utils/scheduleReminderNotification";

export default function NewReminder() {
  const navigation = useNavigation();
  const form = useReminderForm();

  const defaultListIds = ["all", "today", "scheduled", "flag", "done"];

  const allLists = useAppSelector((state) => state.list.lists);
  const lists = allLists.filter(
    (item) => !defaultListIds.includes(item.listId)
  );

  const dispatch = useAppDispatch();

  const {
    title,
    notes,
    selectedList,
    isDetail,
    setIsDetail,
    date,
    time,
    location,
    priority,
    tag,
    flag,
    messaging,
    image,
    url,
  } = form;

  const save = useCallback(async () => {
    if (!selectedList?.listId || title.trim() === "") {
      Alert.alert("Warning", "Please enter Title and select a List at least!");
      return;
    }

    try {
      const id = Date.now().toString();

      const reminder = {
        id,
        title,
        note: notes,
        details: {
          date: date.value,
          time: time.value,
          tag: tag.value,
          location: location.enabled,
          flagged: flag.enabled,
          messaging: messaging.enabled,
          priority: priority.value,
          photoUri: image,
          url,
        },
        listId: selectedList.listId,
      };

      dispatch(createReminderThunk(reminder));

      if (Platform.OS === "ios") {
        Alert.alert("Success", "Your reminder has been saved successfully!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Success", "Saved!");
        navigation.goBack();
      }

      if (
        date.enabled === 1 &&
        time.enabled === 1 &&
        date.value &&
        time.value
      ) {
        const [day, month, year] = date.value.split("/").map(Number);
        const [hour, minute] = time.value.split(":").map(Number);

        const fullDate = new Date(year, month - 1, day, hour, minute);
        if (!isNaN(fullDate.getTime()) && fullDate > new Date()) {
          await scheduleReminderNotification(id, title, fullDate);
        }
      }
    } catch (error: any) {
      Alert.alert("Warning", `Error: ${error.message}`);
    }
  }, [
    selectedList,
    title,
    notes,
    date,
    time,
    location,
    priority,
    messaging,
    flag,
    tag,
    image,
    url,
    navigation,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "New Reminder",
      headerLeft: () => (
        <Pressable
          onPress={() => {
            if (isDetail) setIsDetail(false);
            else navigation.goBack();
          }}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>Cancel</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={() => save()}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>Save</Text>
        </Pressable>
      ),
    });
  }, [save, navigation]);
  return (
    <View style={styles.container}>
      <StatusBar style="light"/>
      <RForm form={form} lists={lists} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },

  pressed: {
    opacity: 0.5,
    backgroundColor: "#F2F2F7",
  },
});
