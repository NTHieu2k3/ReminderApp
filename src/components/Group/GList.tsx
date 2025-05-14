import { Group } from "models/Group";
import { List } from "models/List";
import { FlatList, StyleSheet } from "react-native";
import GItem from "./GItem";
import { Reminder } from "models/Reminder";

interface GListProps {
  readonly groups: Group[];
  readonly lists: List[];
  readonly reminders: Reminder[];
  readonly isEditMode?: boolean;
  readonly onDelete?: (group: Group) => void;
  readonly onPressItem?: (list: List) => void;
  readonly onDeleteItem?: (list: List) => void;
}

export default function GList({
  groups,
  lists,
  reminders,
  isEditMode,
  onDelete,
  onPressItem,
  onDeleteItem,
}: GListProps) {
  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.groupId}
      renderItem={({ item }) => (
        <GItem
          group={item}
          lists={lists}
          reminder={reminders}
          isEditMode={isEditMode}
          onDeleteGroup={onDelete}
          onPressItem={onPressItem}
          onDeleteItem={onDeleteItem}
        />
      )}
      scrollEnabled={false}
      initialNumToRender={5}
      maxToRenderPerBatch={10}
      removeClippedSubviews={true}
    />
  );
}

const styles = StyleSheet.create({});
