import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NameType } from "enums/name-screen.enum";
import { Reminder } from "models/Reminder";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  deleteReminderThunk,
  updateReminderThunk,
} from "store/actions/reminderActions";
import { useAppDispatch } from "store/hooks";
import { RootStackParam } from "type/navigation.type";

interface RItemProps {
  readonly reminder: Reminder;
  readonly onCompleted?: (id: string, isCompleted: boolean) => void;
  readonly isEdit?: boolean;
  readonly editId?: string | null;
  readonly onEdit?: (id: string, title: string) => void;
}

type BooleanNumber = 0 | 1;

export default function RItem({
  reminder,
  onCompleted,
  isEdit,
  editId,
  onEdit,
}: RItemProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [editedTitle, setEditedTitle] = useState(reminder.title);

  const isEditingThis = isEdit && editId === reminder.id;

  const dispatch = useAppDispatch();

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (!isEdit) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowAction(false));
    }
  }, [isEdit]);

  function triggerEditmode() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(translateX, {
      toValue: -240,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowAction(true));
  }

  function closeEditMode() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowAction(false));
  }

  function handlePress() {
    if (isEditingThis) {
      closeEditMode();
    } else if (!isEditingThis) {
      setEditedTitle(reminder.title);
      onEdit?.(reminder.id, reminder.title);
    }
  }

  function infoButton() {
    if (showAction) return closeEditMode();
    else if (!showAction) return triggerEditmode();
  }

  function delR() {
    try {
      dispatch(deleteReminderThunk(reminder.id));
    } catch (error: any) {
      Alert.alert("Warning", `Error: ${error.message}`);
    }
  }

  async function updateFlag() {
    try {
      const newFlag: BooleanNumber = reminder.details.flagged === 1 ? 0 : 1;

      const updateR: Reminder = {
        ...reminder,
        details: {
          ...reminder.details,
          flagged: newFlag,
        },
      };
      await dispatch(updateReminderThunk(updateR));
    } catch (error: any) {
      Alert.alert("Warning", `Error: ${error.message}`);
    }
  }

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  function prioriryTitle(p: any) {
    if (p === "Low") return `! ${reminder.title}`;
    else if (p === "Medium") return `!! ${reminder.title}`;
    else if (p === "High") return `!!! ${reminder.title}`;
    else return `${reminder.title}`;
  }
  return (
    <View style={styles.wrapper}>
      <View style={styles.actionWrapper}>
        {showAction && (
          <View style={styles.actionContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.pressed,
                { backgroundColor: "#9a9896" },
              ]}
              onPress={() =>
                navigation.navigate(NameType.DETAILREMINDER, {
                  id: reminder.id,
                })
              }
            >
              <Text style={styles.actionText}>Detail</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.pressed,
                { backgroundColor: "#eb3434" },
              ]}
              onPress={() => updateFlag()}
            >
              <Text style={styles.actionText}>
                {reminder.details.flagged === 0 ? "Flag" : "Unflag"}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.pressed,
                { backgroundColor: "#c00d0d" },
              ]}
              onPress={() => delR()}
            >
              <Text style={styles.actionText}>Delete</Text>
            </Pressable>
          </View>
        )}
      </View>
      <Animated.View
        style={[styles.animation, { transform: [{ translateX }] }]}
      >
        <Pressable
          style={({ pressed }) => [styles.container, pressed && styles.pressed]}
          onPress={handlePress}
        >
          <Pressable
            style={[reminder.status === 1 ? styles.icon : null]}
            onPress={() => {
              const newStatus = !isSelected;
              setIsSelected(newStatus);
              onCompleted?.(reminder.id, newStatus);
            }}
          >
            <Ionicons
              name={reminder.status === 1 ? "ellipse-sharp" : "ellipse-outline"}
              size={reminder.status === 1 ? 25 : 30}
              color={reminder.status === 1 ? "#6060ed" : "#dfdfe6"}
            />
          </Pressable>

          <View style={styles.content}>
            <View style={styles.info}>
              {isEditingThis ? (
                <TextInput
                  style={styles.title}
                  value={editedTitle}
                  onChangeText={(text) => {
                    setEditedTitle(text);
                    onEdit?.(reminder.id, text);
                  }}
                />
              ) : (
                <Text style={styles.title}>
                  {prioriryTitle(reminder.details.priority)}
                </Text>
              )}

              {reminder.note && (
                <Text style={styles.note}>{reminder.note}</Text>
              )}

              {(reminder.details.date || reminder.details.time) && (
                <Text style={styles.dateTime}>
                  Reminders -{" "}
                  {reminder.details.date ? reminder.details.date + "," : ""}{" "}
                  {reminder.details.time}
                </Text>
              )}

              {reminder.details.photoUri && (
                <Image src={reminder.details.photoUri} style={styles.image} />
              )}
            </View>
            {reminder.details.flagged === 1 && (
              <View style={styles.flaged}>
                <Ionicons
                  name="flag-sharp"
                  size={25}
                  color="#ef893a"
                  style={{ marginLeft: 10 }}
                />
              </View>
            )}

            {isEditingThis && (
              <Pressable onPress={infoButton}>
                <Ionicons
                  name="information-circle-outline"
                  size={27}
                  color="#007AFF"
                />
              </Pressable>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  icon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderColor: "#6060ed",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 20,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#d2d2d5",
    borderBottomWidth: 1,
    paddingVertical: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#1C1C1E",
  },

  note: {
    fontSize: 15,
    color: "#8E8E93",
    marginTop: 2,
  },

  dateTime: {
    fontSize: 15,
    color: "#FF3B30",
    marginTop: 4,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginTop: 8,
  },

  info: {
    width: "80%",
  },

  flaged: {},

  pressed: {
    opacity: 0.5,
    backgroundColor: "#F2F2F7",
  },

  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: 80,
  },

  actionContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 240,
    height: "100%",
    flexDirection: "row",
    backgroundColor: "transparent",
  },

  actionText: {
    color: "white",
    fontWeight: "bold",
  },

  wrapper: {
    position: "relative",
    overflow: "hidden",
    marginBottom: 10,
  },

  animation: {
    position: "relative",
    zIndex: 1,
    backgroundColor: "#F2F2F7",
  },

  actionWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 0,
  },
});
