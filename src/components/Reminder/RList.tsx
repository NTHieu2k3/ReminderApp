import { FlatList, StyleSheet, Text, View } from "react-native";
import RItem from "./RItem";
import { useReminderContext } from "context/reminder-context";

interface RListPRops {
  readonly listId: string;
}

export default function RList({ listId }: RListPRops) {
  const reminderCtx = useReminderContext();
  const reminders = reminderCtx.reminders.filter(
    (item) => item.listId === listId
  );

  return (
    <View>
      {reminders.length == 0 && (
        <Text style={styles.fallbackText}>
          Do not have any Reminder in this List
        </Text>
      )}
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RItem reminder={item} />}
        scrollEnabled={false}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fallbackText: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 20,
    marginTop: 20,
  },
});
