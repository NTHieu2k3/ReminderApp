import { FlatList, StyleSheet, Text, View } from "react-native";
import RItem from "./RItem";
import smartFilter from "utils/smartFilter";
import { useAppSelector } from "store/hooks";

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
  const listReminders = useAppSelector((state) => state.reminder.reminders);

  const reminders = smartFilter(listReminders, listId);

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
    fontStyle: "italic",
  },
});
