import { Group } from "models/Group";
import { List } from "models/List";
import { FlatList, StyleSheet } from "react-native";
import GItem from "./GItem";

interface GListProps {
  readonly groups: Group[];
  readonly lists: List[];
  readonly isEditMode?: boolean;
  readonly onDelete?: (group: Group) => void;
  readonly onPressItem?: (list: List) => void;
}

export default function GList({
  groups,
  lists,
  isEditMode,
  onDelete,
  onPressItem,
}: GListProps) {
  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.groupId}
      renderItem={({ item }) => (
        <GItem
          group={item}
          lists={lists}
          isEditMode={isEditMode}
          onDeleteGroup={onDelete}
          onDeleteItem={() => onPressItem}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({});
