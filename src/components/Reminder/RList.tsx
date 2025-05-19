import { FlatList, StyleSheet, Text, View } from "react-native";
import RItem from "./RItem";
import { useReminderContext } from "context/reminder-context";
import smartFilter from "utils/smartFilter";

interface RListPRops {
  readonly listId: string;
  readonly onToggleComplete?: (id: string, newStatus: boolean) => void;
  readonly isEdit?: boolean;
  readonly editId?: string | null;
  readonly onEdit?: (id: string, title: string) => void;
  readonly showCompleted: boolean;
}

export default function RList({
  listId,
  onToggleComplete,
  isEdit,
  editId,
  onEdit,
  showCompleted,
}: RListPRops) {
  const reminderCtx = useReminderContext();

  const reminders = smartFilter(reminderCtx.reminders, listId).filter(
    (item) => showCompleted || item.status === 0
  );

  return (
    <View>
      {reminders.length == 0 && (
        <Text style={styles.fallbackText}>
          Do not have any uncompleted Reminder in this List
        </Text>
      )}
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RItem
            reminder={item}
            onEdit={onEdit}
            isEdit={isEdit}
            editId={editId}
            onCompleted={(id, completed) => onToggleComplete?.(id, completed)}
          />
        )}
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
