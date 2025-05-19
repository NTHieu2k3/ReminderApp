import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { IoniconsName } from "type/ionicons.type";

const COLORS = [
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#007AFF",
  "#5E5CE6",
  "#AF52DE",
  "#FF2D55",
  "#BF5AF2",
  "#A2845E",
  "#636366",
  "#D0AEB0",
] as const;

const ICONS = [
  "happy-outline",
  "list",
  "bookmark",
  "key",
  "gift",
  "calendar",
  "school",
  "pencil",
  "document",
  "book",
  "wallet",
  "card",
  "barbell",
  "walk",
  "restaurant",
  "wine",
  "medkit",
  "heart",
  "home",
  "business",
  "library",
  "tv",
  "musical-notes",
] as const;

export interface LFormData {
  name: string;
  color: string;
  icon: IoniconsName;
  smartList: boolean;
}
interface LFormProps {
  readonly defaultValue: LFormData;
  readonly onChange: (data: LFormData) => void;
  readonly isSaving: boolean;
}
export default function LForm({
  defaultValue,
  onChange,
  isSaving,
}: LFormProps) {
  const [name, setName] = useState(defaultValue.name);
  const [color, setColor] = useState(defaultValue.color);
  const [icon, setIcon] = useState<(typeof ICONS)[number]>(
    defaultValue.icon as any
  );
  const [smartList, setSmartList] = useState(defaultValue.smartList ?? false);

  useEffect(() => {
    onChange({
      name,
      icon,
      color,
      smartList,
    });
  }, [name, icon, color, smartList]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={[styles.circleIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={50} color="white" />
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="List Name"
          placeholderTextColor="#C7C7CD"
          value={name}
          onChangeText={setName}
        />
      </View>

      <TouchableOpacity
        style={styles.smartRow}
        onPress={() => setSmartList((prev) => !prev)}
      >
        <Ionicons name="filter-outline" size={20} color="#007AFF" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.smartTitle}>
            {smartList ? "Smart List" : "Standard List"}
          </Text>
          <Text style={styles.smartDesc}>
            Organize using tags and other filters
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
      </TouchableOpacity>

      {/* Color Picker */}
      <View style={styles.colorSection}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={COLORS}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setColor(item)}
              style={[
                styles.colorCircle,
                { backgroundColor: item },
                color === item && styles.selectedColor,
              ]}
            />
          )}
          numColumns={6}
          scrollEnabled={false}
          contentContainerStyle={{ alignItems: "center" }}
        />
      </View>
      {/* Icon Picker */}
      <View style={styles.iconGrid}>
        <FlatList
          data={ICONS}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setIcon(item)}
              style={[styles.iconOption, icon === item && styles.selectedIcon]}
            >
              <Ionicons name={item as any} size={20} color="#3C3C43" />
            </TouchableOpacity>
          )}
          numColumns={6}
          scrollEnabled={false}
          contentContainerStyle={{ alignItems: "center" }}
        />
      </View>
      {/* Loading Indicator */}
      {isSaving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
  },

  headerBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 16,
  },

  circleIcon: {
    width: 90,
    height: 90,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  textInput: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: "#1C1C1E",
    width: "90%",
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
  },

  smartRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  smartTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  smartTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
  },

  smartDesc: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },

  colorSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
  },

  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginHorizontal: 10,
    marginTop: 10,
  },

  selectedColor: {
    borderWidth: 2,
    borderColor: "#C7C7CC",
  },

  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
  },

  iconOption: {
    backgroundColor: "#E5E5EA",
    padding: 8,
    borderRadius: 25,
    height: 40,
    width: 40,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedIcon: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  pressed: {
    opacity: 0.5,
    backgroundColor: "#c8c8cb",
  },
});
