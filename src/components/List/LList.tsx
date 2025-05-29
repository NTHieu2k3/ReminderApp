import { List } from "models/List";
import { FlatList, StyleSheet, View, Text } from "react-native";
import LItem from "./LItem";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Reminder } from "models/Reminder";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

interface LListProps {
  readonly lists: List[];
  readonly reminder: Reminder[];
  readonly isEditMode?: boolean;
  readonly onDelete?: (list: List) => void;
  readonly onPressItem?: (list: List) => void;
}
export default function LList({
  lists,
  reminder,
  isEditMode,
  onDelete,
  onPressItem,
}: LListProps) {
  const smartLists = useMemo(
    () => lists.filter((list) => list.smartList),
    [lists]
  );
  const myLists = useMemo(
    () => lists.filter((list) => !list.smartList && !list.groupId),
    [lists]
  );

  const [orderedLists, setOrderedLists] = useState(myLists);

  useEffect(() => {
    setOrderedLists(myLists); // cập nhật lại khi props thay đổi
  }, [myLists]);

  const renderSmartItem = useCallback(
    ({ item }: { item: List }) => (
      <LItem
        list={item}
        reminders={reminder}
        isEditMode={isEditMode}
        onDelete={onDelete}
        onPress={() => onPressItem?.(item)}
      />
    ),
    [isEditMode, onDelete, onPressItem]
  );

  const renderMyItem = useCallback(
    ({ item }: { item: List }) => (
      <LItem
        list={item}
        reminders={reminder}
        isEditMode={isEditMode}
        onDelete={onDelete}
        onPress={() => onPressItem?.(item)}
      />
    ),
    [isEditMode, onDelete, onPressItem]
  );

  const renderDraggableItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<List>) => (
      <LItem
        list={item}
        reminders={reminder}
        isEditMode={isEditMode}
        onDelete={onDelete}
        onPress={() => onPressItem?.(item)}
        onDragStart={drag}
      />
    ),
    [reminder, isEditMode, onDelete, onPressItem]
  );

  return (
    <View>
      {smartLists.length > 0 && (
        <View style={styles.container}>
          <FlatList
            data={smartLists}
            key={isEditMode ? "edit" : "view"}
            keyExtractor={(item) => item.listId}
            renderItem={renderSmartItem}
            scrollEnabled={false}
            {...(!isEditMode && {
              numColumns: 2,
              columnWrapperStyle: styles.columnWrapper,
            })}
          />
        </View>
      )}
      {myLists.length > 0 && (
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>My Lists</Text>
          <View style={styles.myList}>
            <DraggableFlatList
              data={orderedLists}
              keyExtractor={(item) => item.listId}
              renderItem={renderDraggableItem}
              onDragEnd={({ data }) => setOrderedLists(data)}
              scrollEnabled={false}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  columnWrapper: {
    justifyContent: "space-between",
    rowGap: 12,
    paddingHorizontal: 4,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 12,
  },

  myList: {
    backgroundColor: "white",
    borderRadius: 12,
  },
});
