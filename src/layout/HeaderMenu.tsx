import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Menu } from "react-native-paper";
import { IoniconsName } from "type/ionicons.type";

type MenuAction = {
  title: string;
  icon: IoniconsName;
  onPress: () => void;
};

interface HeaderMenuProps {
  readonly menuItems: MenuAction[];
  readonly leftButton?: () => void;
  readonly isEditMode?: boolean;
  readonly toggleEditMode?: () => void;
}

export default function HeaderMenu({
  menuItems,
  leftButton,
  isEditMode,
  toggleEditMode,
}: HeaderMenuProps) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      {/* Nút bên trái (Go back hoặc gì đó) */}
      {leftButton && (
        <View style={styles.leftContainer}>
          <Pressable
            onPress={leftButton}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <Ionicons name="arrow-back-outline" size={25} color="#007AFF" />
            <Text style={styles.doneText}>Go back</Text>
          </Pressable>
        </View>
      )}

      {/* Nút Menu nằm bên phải cố định */}
      <View style={styles.rightContainer}>
        <Menu
          contentStyle={[
            styles.menuContent,
            visible && styles.menuContentVisible,
          ]}
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            isEditMode ? (
              <Pressable onPress={toggleEditMode}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setVisible(true)}
                style={[styles.icon, visible && { opacity: 0.5 }]}
              >
                <Ionicons
                  name="ellipsis-horizontal-outline"
                  size={18}
                  color="#0770e1"
                />
              </Pressable>
            )
          }
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              style={styles.menuItemContainer}
              key={item.title}
              onPress={() => {
                setVisible(false);
                item.onPress();
              }}
            >
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons
                name={item.icon}
                size={20}
                color="#1C1C1E"
                style={{ paddingLeft: 10 }}
              />
            </TouchableOpacity>
          ))}
        </Menu>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F2F2F7",
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  rightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },

  menuContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
  },

  menuItem: {
    fontSize: 14,
    color: "#1C1C1E",
  },

  icon: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#007AFF",
    height: 25,
    width: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  menuItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    minWidth: 150,
  },

  menuText: {
    fontSize: 16,
    color: "#1C1C1E",
  },

  menuContentVisible: {
    marginTop: 30,
  },

  doneText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },

  pressed: {
    opacity: 0.5,
  },

  row: {
    flexDirection: "row",
  },
});
