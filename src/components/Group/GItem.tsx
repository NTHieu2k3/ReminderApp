import { Ionicons } from "@expo/vector-icons";
import LItem from "components/List/LItem";
import { Group } from "models/Group";
import { List } from "models/List";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  LayoutAnimation,
  Pressable,
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
  readonly onPressGroup?: () => void;
  readonly onDeleteGroup?: (group: Group) => void;
  readonly isEditMode?: boolean;
}

export default function GItem({
  group,
  lists,
  onPressItem,
  onDeleteItem,
  onPressGroup,
  onDeleteGroup,
  isEditMode,
}: GItemProps) {
  const [expanded, setExpanded] = useState(false);
  const groupList = useMemo(
    () => lists.filter((item) => item.groupId === group.groupId),
    [lists, group.groupId]
  );

  const translateX = useRef(new Animated.Value(0)).current;
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!isEditMode) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowDelete(false));
    }
  }, [isEditMode]);

  function triggerDeleteMode() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    Animated.timing(translateX, {
      toValue: -80,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowDelete(true));
  }

  function closeDeleteMode() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowDelete(false));
  }

  function handleDelete() {
    if (onDeleteGroup) onDeleteGroup(group);
  }

  function handlePress() {
    if (isEditMode && showDelete) {
      closeDeleteMode();
    } else {
      setExpanded(!expanded);
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.deleteWrapper}>
        {showDelete && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        )}
        <Animated.View
          style={[styles.container, { transform: [{ translateX }] }]}
        >
          {isEditMode && (
            <TouchableOpacity onPress={triggerDeleteMode}>
              <Ionicons
                name="remove-circle"
                size={27}
                color="red"
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
          )}

          <Pressable style={styles.groupItem} onPress={handlePress}>
            <View style={styles.row}>
              <Ionicons
                name="albums-outline"
                size={35}
                color="#8E8E93"
                style={{ marginLeft: 6 }}
              />
              <Text style={styles.name}>{group.name}</Text>
            </View>
            <View style={styles.row}>
              {expanded || isEditMode ? null : (
                <Text style={styles.amount}>{groupList.length}</Text>
              )}
              <Ionicons
                name={
                  expanded || isEditMode ? "chevron-down" : "chevron-forward"
                }
                size={20}
                color="#8E8E93"
                style={{ marginLeft: 6 }}
              />
            </View>
          </Pressable>
        </Animated.View>
      </View>

      {(expanded || isEditMode) && (
        <FlatList
          data={groupList}
          keyExtractor={(item) => item.listId}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <LItem
                list={item}
                isEditMode={isEditMode}
                onDelete={onDeleteItem}
                onPress={() => onPressItem?.(item)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  deleteWrapper: {
    position: "relative",
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 10,
    zIndex: 2,
  },

  groupItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    fontSize: 17,
    fontWeight: "500",
    paddingLeft: 10,
    color: "#1C1C1E",
  },

  amount: {
    fontSize: 17,
    fontWeight: "500",
    paddingRight: 10,
    color: "#8E8E93",
  },

  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    zIndex: 1,
  },

  deleteText: {
    color: "white",
    fontWeight: "bold",
  },

  item: {
    marginLeft: 10,
    marginTop: 2,
  },
});
