import { List } from "models/List";
import { FlatList, StyleSheet, View, Text } from "react-native";
import LItem from "./LItem";

interface LListProps {
  readonly lists: List[];
  readonly isEditMode?: boolean;
  readonly onDelete?: (list: List) => void;
  readonly onPressItem?: (list: List) => void;
}

export default function LList({
  lists,
  isEditMode,
  onDelete,
  onPressItem,
}: LListProps) {
  const smartLists = lists.filter((list) => list.smartList);
  const myLists = lists.filter((list) => !list.smartList);

  return (
    <View>
      {smartLists.length > 0 && (
        <View style={styles.smart}>
          <FlatList
            data={smartLists}
            key={isEditMode ? "edit" : "view"}
            keyExtractor={(item) => item.listId}
            renderItem={({ item }) => (
              <LItem
                list={item}
                isEditMode={isEditMode}
                onDelete={onDelete}
                onPress={() => onPressItem?.(item)}
              />
            )}
            scrollEnabled={false}
            // ⚠️ Bỏ numColumns và columnWrapperStyle nếu đang ở chế độ chỉnh sửa
            {...(!isEditMode && {
              numColumns: 2,
              columnWrapperStyle: styles.columnWrapper,
            })}
          />
        </View>
      )}
      {myLists.length > 0 && (
        <View style={styles.mylistContainer}>
          <Text style={styles.sectionTitle}>My Lists</Text>
          <View style={styles.myList}>
            <FlatList
              data={myLists}
              keyExtractor={(item) => item.listId}
              renderItem={({ item }) => (
                <LItem
                  list={item}
                  isEditMode={isEditMode}
                  onDelete={onDelete}
                  onPress={() => onPressItem?.(item)}
                />
              )}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flex: 1,
    backgroundColor: "#F2F2F7",
  },

  smart: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  mylistContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  columnWrapper: {
    justifyContent: "space-between",
    rowGap: 12,
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
