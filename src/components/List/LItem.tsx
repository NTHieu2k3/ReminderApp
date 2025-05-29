import { Ionicons } from "@expo/vector-icons";
import { List } from "models/List";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Reminder } from "models/Reminder";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParam } from "type/navigation.type";
import { NameType } from "enums/name-screen.enum";
import smartFilter from "utils/smartFilter";

interface LItemProps {
  readonly list: List;
  readonly reminders?: Reminder[];
  readonly onPress: (list: List) => void;
  readonly isEditMode?: boolean;
  readonly onDragStart?: () => void;
  readonly onDelete?: (list: List) => void;
}

export default function LItem({
  list,
  reminders,
  onPress,
  isEditMode = false,
  onDelete,
  onDragStart,
}: LItemProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [showDelete, setShowDelete] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  const amount = useMemo(
    () => smartFilter(reminders ?? [], list.listId),
    [reminders, list.listId]
  );

  // Reset nếu thoát khỏi chế độ chỉnh sửa
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
    setShowDelete(true);
    Animated.timing(translateX, {
      toValue: -80,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  function closeDeleteMode() {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowDelete(false));
  }

  function handleDelete() {
    if (onDelete) onDelete(list);
  }

  function handlePress() {
    if (isEditMode && showDelete) {
      closeDeleteMode();
    } else {
      onPress(list);
    }
  }

  if (!isEditMode) {
    if (list.smartList) {
      return (
        <Pressable
          style={({ pressed }) => [styles.container, pressed && styles.pressed]}
          onPress={() => onPress(list)}
        >
          <Text style={styles.amount}>{amount?.length}</Text>
          <View style={styles.column}>
            <View style={[styles.icon, { backgroundColor: list.color }]}>
              <Ionicons name={list.icon} size={25} color="white" />
            </View>
            <Text style={styles.name}>{list.name}</Text>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        style={({ pressed }) => [styles.myContainer, pressed && styles.pressed]}
        onPress={() => onPress(list)}
      >
        <View style={styles.row}>
          <View style={[styles.myIcon, { backgroundColor: list.color }]}>
            <Ionicons name={list.icon} size={25} color="white" />
          </View>
          <Text style={styles.myName}>{list.name}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.myAmount}>{amount?.length}</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#8E8E93"
            style={{ marginLeft: 6 }}
          />
        </View>
      </Pressable>
    );
  }

  // Edit Mode – cho cả smartList và myList
  return (
    <View style={styles.wrapper}>
      <View style={styles.deleteWrapper}>
        {showDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}

        <Animated.View
          style={[styles.myContainer, { transform: [{ translateX }] }]}
        >
          <TouchableOpacity onPress={triggerDeleteMode}>
            <Ionicons
              name="remove-circle"
              size={27}
              color="red"
              style={{ marginRight: 8 }}
            />
          </TouchableOpacity>

          <Pressable style={styles.row} onPress={handlePress}>
            <View style={[styles.myIcon, { backgroundColor: list.color }]}>
              <Ionicons name={list.icon} size={25} color="white" />
            </View>
            <Text style={styles.myName}>{list.name}</Text>
          </Pressable>

          <View style={styles.rightSection}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(NameType.INFOLIST, { listId: list.listId })
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={27}
                color="#007AFF"
                style={{ marginHorizontal: 5 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPressIn={onDragStart}>
              <Ionicons
                name="reorder-three"
                size={27}
                color="#8E8E93"
                style={{
                  borderLeftWidth: 1,
                  borderColor: "#dfdfe4",
                  paddingLeft: 5,
                }}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  deleteWrapper: {
    position: "relative",
  },

  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 12,
  },

  deleteText: {
    color: "white",
    fontWeight: "bold",
  },

  container: {
    width: "48%",
    height: 95,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  column: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },

  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
  },

  amount: {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: 26,
    fontWeight: "bold",
    color: "#1C1C1E",
  },

  pressed: {
    opacity: 0.9,
    backgroundColor: "#c8c8cb",
  },

  //Standard list
  myContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    zIndex: 1,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  myIcon: {
    width: 35,
    height: 35,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  myName: {
    fontSize: 17,
    color: "#1C1C1E",
    fontWeight: "500",
  },

  myAmount: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
