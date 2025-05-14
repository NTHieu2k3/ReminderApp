import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface BottomBarProps {
  readonly showLeftButton?: boolean;
  readonly colorText?: string;
  readonly showRightButton?: boolean;
  readonly isEditMode?: boolean;
  readonly onLeftPress?: () => void;
  readonly onRightPress?: () => void;
}

export default function BottomBar({
  showLeftButton = false,
  showRightButton = false,
  isEditMode = false,
  colorText,
  onLeftPress,
  onRightPress,
}: BottomBarProps) {
  return (
    <View style={styles.container}>
      {showLeftButton && (
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={onLeftPress}
        >
          {!isEditMode && (
            <Ionicons
              name="add-circle-outline"
              size={28}
              color={colorText ?? styles.textLeft.color}
              style={{ paddingBottom: 20 }}
            />
          )}
          <Text
            style={
              isEditMode
                ? styles.textRight
                : [styles.textLeft, colorText ? { color: colorText } : null]
            }
          >
            {isEditMode ? "Add Group" : "New Reminder"}
          </Text>
        </Pressable>
      )}

      {showRightButton && (
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={onRightPress}
        >
          <Text style={styles.textRight}>Add List</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0, // nằm sát đáy màn hình
    left: 0,
    right: 0,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "white",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  textLeft: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
    paddingBottom: 20,
  },

  textRight: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
    paddingBottom: 20,
  },

  pressed: {
    opacity: 0.5,
  },
});
