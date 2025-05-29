import { FlatList, StyleSheet, Text, View } from "react-native";
import { Reminder } from "models/Reminder";
import RItem from "./RItem";

interface RListPRops {
  readonly listId: string;
  readonly onToggleComplete?: (id: string, newStatus: boolean) => void;
  readonly isEdit?: boolean;
  readonly editId?: string | null;
  readonly onEdit?: (id: string, title: string) => void;
  readonly showCompleted: boolean;
  readonly reminders: Reminder[];
}

export default function RList({
  listId,
  onToggleComplete,
  isEdit,
  editId,
  onEdit,
  showCompleted,
  reminders,
}: RListPRops) {
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
