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

type MenuAction = {
  title: string;
  onPress: () => void;
};

interface HeaderMenuProps {
  readonly menuItems: MenuAction[];
  readonly isEditMode?: boolean;
  readonly toggleEditMode?: () => void;
}

export default function HeaderMenu({
  menuItems,
  isEditMode,
  toggleEditMode,
}: HeaderMenuProps) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <View style={styles.container}>
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
            key={index}
            onPress={() => {
              setVisible(false);
              item.onPress();
            }}
          >
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    backgroundColor: "#F2F2F7",
  },
  menuContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    elevation: 0, // no shadow
    paddingVertical: 0,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    width: 150,
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
});
