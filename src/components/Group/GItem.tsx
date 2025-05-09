import { Ionicons } from "@expo/vector-icons";
import LItem from "components/List/LItem";
import { Group } from "models/Group";
import { List } from "models/List";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface GItemProps {
  readonly group: Group;
  readonly lists: List[];
  readonly onPressItem?: (list: List) => void;
  readonly onDeleteItem?: (list: List) => void;
  readonly onDeleteGroup?: (group: Group) => void;
  readonly isEditMode?: boolean;
}

export default function GItem({
  group,
  lists,
  onPressItem,
  onDeleteItem,
  onDeleteGroup,
  isEditMode,
}: GItemProps) {
  const [expanded, setExpanded] = useState(false);
  const groupList = lists.filter((item) => item.groupId === group.groupId);

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.7}
      >
        <View style={styles.row}>
          <Ionicons
            name="albums-outline"
            size={24}
            color="#8E8E93"
            style={{ marginLeft: 12 }}
          />
          <Text>{group.name}</Text>
        </View>
        {expanded ? null : (
          <Text style={styles.amount}>{groupList.length}</Text>
        )}
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#8E8E93"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>

      {expanded && (
        <FlatList
          data={groupList}
          keyExtractor={(item) => item.listId}
          renderItem={({ item }) => (
            <LItem
              list={item}
              isEditMode={isEditMode}
              onDelete={onDeleteItem}
              onPress={() => onPressItem}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  row: {},

  name: {},

  amount: {},
});
