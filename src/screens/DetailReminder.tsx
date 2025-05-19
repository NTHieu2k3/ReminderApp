import { useNavigation, useRoute } from "@react-navigation/native";
import RForm from "components/Reminder/RForm";
import { useListContext } from "context/list-context";
import { useReminderContext } from "context/reminder-context";
import { updateReminder } from "database/ReminderDB";
import { useReminderForm } from "hooks";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text } from "react-native";

export default function DetailReminder() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };

  const form = useReminderForm();
  const reminderCtx = useReminderContext();
  const listCtx = useListContext();

  const reminder = reminderCtx.reminders.find((r) => r.id === id);

  useEffect(() => {
    if (!reminder) return;

    form.setTitle(reminder.title);
    form.setNotes(reminder.note ?? "");
    form.setSelectedList(
      listCtx.lists.find((l) => l.listId === reminder.listId) || null
    );

    form.date.set(reminder.details.date ?? "");
    if (reminder.details.date) form.date.toggle();

    form.time.set(reminder.details.time ?? "");
    if (reminder.details.time) form.time.toggle();

    form.priority.set(reminder.details.priority ?? "");
    form.tag.set(reminder.details.tag ?? "");

    form.location.setEnabled(reminder.details.location ?? 0);
    form.flag.setEnabled(reminder.details.flagged ?? 0);
    form.messaging.setEnabled(reminder.details.messaging ?? 0);

    form.setImage(reminder.details.photoUri ?? "");
    form.setUrl(reminder.details.url ?? "");
  }, []);

  const {
    title,
    notes,
    selectedList,
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
      const updated = {
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

      await updateReminder(updated, id);
      reminderCtx.updateR(updated);

      if (Platform.OS === "ios") {
        Alert.alert("Success", "Updated!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Success", "Updated!");
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert("Warning", `Error: ${error.message}`);
    }
  }, [
    id,
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
      headerTitle: "Detail",
      headerLeft: () => (
        <Pressable
          onPress={() => {
            navigation.goBack();
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

  if (!reminder) return null;

  return (
    <RForm
      form={form}
      lists={listCtx.lists.filter((l) => !l.smartList)}
      forceShowDetails
    />
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
    backgroundColor: "#F2F2F7",
  },
});
