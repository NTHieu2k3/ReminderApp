import { useState } from "react";
import { Pressable, StyleSheet, Text, View, Switch, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { usePhotoLibrary, useTakePhoto } from "components/ImageOptions";

const PRIORITY_OPTIONS = ["None", "Low", "Medium", "High"];
const TAG_OPTIONS = ["None", "Work", "Personal", "Urgent", "Study"];
const IMAGE_OPTIONS = ["Photo Library", "Take Photo", "Scan Document"];

interface DetailItemProps {
  readonly type:
    | "date"
    | "time"
    | "tags"
    | "priority"
    | "location"
    | "whenMessaging"
    | "flag"
    | "addImage";
  readonly title?: string;
  readonly value?: string;
  readonly enabled?: boolean;
  readonly onToggleEnabled?: (val: boolean) => void;
  readonly onChange?: (value: string) => void;
}

export default function DetailReminder({
  type,
  title,
  value,
  enabled,
  onToggleEnabled,
  onChange,
}: DetailItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [currentValue, setCurrentValue] = useState<Date>(new Date());

  const takePhoto = useTakePhoto();
  const libraryPhoto = usePhotoLibrary();

  const handleImageOptions = async (opt?: string) => {
    if (opt === "Take Photo") {
      const uri = await takePhoto();
      if (uri) onChange?.(uri);
    }

    if (opt === "Photo Library") {
      const uri = await libraryPhoto();
      if (uri) onChange?.(uri);
    }
  };

  const onPress = () => {
    if ((type === "date" || type === "time") && enabled) {
      setShowPicker((prev) => !prev);
    } else {
      setExpanded((prev) => !prev);
    }
  };

  const getOptions = () => {
    if (type === "tags") return TAG_OPTIONS;
    if (type === "priority") return PRIORITY_OPTIONS;
    if (type === "addImage") return IMAGE_OPTIONS;
    return [];
  };

  const options = getOptions();

  const handleChange = (_event: any, selected?: Date) => {
    if (selected) {
      setCurrentValue(selected);
      const formatted =
        type === "date"
          ? selected.toLocaleDateString()
          : selected.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
      onChange?.(formatted);
    }
  };

  function display() {
    if (type === "date") return "inline";
    if (type === "time") return "spinner";
  }

  const isToggleable =
    type === "date" ||
    type === "time" ||
    type === "whenMessaging" ||
    type === "flag" ||
    type === "location";

  return (
    <View>
      <View style={styles.container}>
        <Pressable
          style={styles.left}
          onPress={onPress}
          disabled={isToggleable ? !enabled : false}
        >
          <Text style={styles.title}>{title}</Text>

          {type === "addImage" && !!value && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: value }} style={styles.thumbnail} />
              <Pressable
                onPress={() => onChange?.("")}
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && { opacity: 0.5 },
                ]}
              >
                <Ionicons name="close-circle" size={22} color="#FF3B30" />
              </Pressable>
            </View>
          )}

          {(type === "date" ||
            type === "time" ||
            type === "priority" ||
            type === "tags") && (
            <Text style={styles.value}>{value ?? "None"}</Text>
          )}
        </Pressable>

        {isToggleable ? (
          <Switch
            value={enabled}
            onValueChange={(val) => {
              onToggleEnabled?.(val);
              if (!val) {
                setShowPicker(false);
                onChange?.("");
              } else {
                const defaultFormatted =
                  type === "date"
                    ? currentValue.toLocaleDateString()
                    : currentValue.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                onChange?.(defaultFormatted);
              }
            }}
          />
        ) : type !== "addImage" ? (
          <Ionicons
            name={expanded ? "chevron-down" : "chevron-forward"}
            size={20}
            color="#C7C7CC"
          />
        ) : null}
      </View>

      {enabled && showPicker && (type === "date" || type === "time") && (
        <DateTimePicker
          mode={type}
          value={currentValue}
          display={display()}
          onChange={handleChange}
        />
      )}

      {expanded && options.length > 0 && (
        <View style={styles.options}>
          {options.map((opt) => (
            <Pressable
              key={opt}
              style={[
                styles.option,
                value === opt &&
                  type !== "addImage" && {
                    backgroundColor: "#DCEBFF",
                  },
              ]}
              onPress={() => [
                type === "addImage" ? handleImageOptions(opt) : onChange?.(opt),
                setExpanded(false),
              ]}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    height: 70,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
    color: "#007AFF",
    marginTop: 4,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginTop: 6,
  },
  options: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    marginLeft: 20,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  optionText: {
    fontSize: 16,
    color: "#1C1C1E",
  },
  imageContainer: {
    position: "relative",
    marginTop: 6,
    alignSelf: "flex-start",
  },

  deleteButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
});
