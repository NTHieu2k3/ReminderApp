import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NameType } from "enums/name-screen.enum";
import { Reminder } from "models/Reminder";
import React, { useRef, useState, useEffect } from "react";
import {
  Alert,
  Animated,
  LayoutAnimation,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
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
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  const [isSelected, setIsSelected] = useState(reminder.status === 0);
  const [showAction, setShowAction] = useState(false);
  const [editedTitle, setEditedTitle] = useState(reminder.title);

  const translateX = useRef(new Animated.Value(0)).current;
  const swipeableRef = useRef<Swipeable>(null);
  const DRAG_THRESHOLD = -240;

  const isEditingThis = isEdit && editId === reminder.id;

  // Animated values cho 3 nút
  const detailAnim = useRef(new Animated.Value(0)).current;
  const flagAnim = useRef(new Animated.Value(0)).current;
  const deleteAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showAction) {
      Animated.stagger(1, [
        Animated.timing(detailAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(flagAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(deleteAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(detailAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(flagAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(deleteAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showAction]);

  const getAnimatedStyle = (animValue: Animated.Value) => ({
    opacity: animValue,
    transform: [
      {
        translateX: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  });

  // PanResponder xử lý lần trượt 1
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dx < 0 && !showAction;
      },
      onPanResponderGrant: () => {
        translateX.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx <= 0 && gestureState.dx >= DRAG_THRESHOLD) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > -20) {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setShowAction(false));
        } else {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setShowAction(true);
          Animated.timing(translateX, {
            toValue: DRAG_THRESHOLD,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.timing(translateX, {
          toValue: showAction ? DRAG_THRESHOLD : 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  // Hàm xóa reminder ngay lập tức
  function delR() {
    swipeableRef.current?.close();
    dispatch(deleteReminderThunk(reminder.id));
    setShowAction(false);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  // Hàm cập nhật flag
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
      swipeableRef.current?.close();
      setShowAction(false);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } catch (error: any) {
      Alert.alert("Warning", `Error: ${error.message}`);
    }
  }

  function prioriryTitle(p: any) {
    if (p === "Low") return `! ${reminder.title}`;
    else if (p === "Medium") return `!! ${reminder.title}`;
    else if (p === "High") return `!!! ${reminder.title}`;
    else return `${reminder.title}`;
  }

  // Render nút xóa nền đỏ lần trượt 2
  function renderRightDelete() {
    return (
      <View
        style={[
          styles.actionButton,
          { backgroundColor: "#ff3b30", width: 80, justifyContent: "center" },
        ]}
      >
        <Ionicons name="trash" size={30} color="white" />
      </View>
    );
  }

  function onSwipeableRightOpen() {
    delR();
  }

  function onSwipeableClose() {
    swipeableRef.current?.close();
  }

  function infoButton() {
    if (showAction) {
      // Đóng action
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowAction(false));
    } else {
      // Mở action
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowAction(true);
      Animated.timing(translateX, {
        toValue: DRAG_THRESHOLD,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.actionWrapper}>
        {showAction && (
          <View style={styles.actionContainer}>
            <Animated.View
              style={[
                styles.actionButton,
                getAnimatedStyle(detailAnim),
                { backgroundColor: "#9a9896" },
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.actionPressable,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  swipeableRef.current?.close();
                  navigation.navigate(NameType.DETAILREMINDER, {
                    id: reminder.id,
                  });
                }}
              >
                <Text style={styles.actionText}>Detail</Text>
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[
                styles.actionButton,
                getAnimatedStyle(flagAnim),
                { backgroundColor: "#eb3434" },
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.actionPressable,
                  pressed && styles.pressed,
                ]}
                onPress={updateFlag}
              >
                <Text style={styles.actionText}>
                  {reminder.details.flagged === 0 ? "Flag" : "Unflag"}
                </Text>
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[
                styles.actionButton,
                getAnimatedStyle(deleteAnim),
                { backgroundColor: "#c00d0d" },
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.actionPressable,
                  pressed && styles.pressed,
                ]}
                onPress={delR}
              >
                <Text style={styles.actionText}>Delete</Text>
              </Pressable>
            </Animated.View>
          </View>
        )}
      </View>

      <Swipeable
        ref={swipeableRef}
        friction={2}
        rightThreshold={40}
        overshootRight={false}
        renderRightActions={renderRightDelete}
        onSwipeableOpen={(direction) => {
          if (direction === "right") {
            onSwipeableRightOpen();
          }
        }}
        onSwipeableClose={onSwipeableClose}
        enabled={showAction}
      >
        <Animated.View
          pointerEvents={showAction ? "box-none" : "auto"}
          {...(!showAction ? panResponder.panHandlers : {})}
          style={[styles.animation, { transform: [{ translateX }] }]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.container,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              if (isEditingThis) {
                Animated.timing(translateX, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }).start(() => {
                  setShowAction(false);
                });
              } else {
                setEditedTitle(reminder.title);
                onEdit?.(reminder.id, reminder.title);
              }
            }}
          >
            <Pressable
              style={[reminder.status === 1 ? styles.icon : null]}
              onPress={() => {
                setIsSelected((prev) => !prev);
                onCompleted?.(reminder.id, isSelected);
              }}
            >
              <Ionicons
                name={
                  reminder.status === 1 ? "ellipse-sharp" : "ellipse-outline"
                }
                size={reminder.status === 1 ? 25 : 30}
                color={reminder.status === 1 ? "#6060ed" : "#dfdfe6"}
              />
            </Pressable>

            <View style={styles.content}>
              <View style={{ flex: 1, flexDirection: "column" }}>
                {/* Phần text */}
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
                  <Text
                    style={[
                      styles.title,
                      { color: reminder.status === 0 ? "#1C1C1E" : "#e0d8d8" },
                    ]}
                  >
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
                  <Image
                    source={{ uri: reminder.details.photoUri }}
                    style={styles.image}
                  />
                )}
              </View>

              {/* Icon cờ bên phải */}
              {reminder.details.flagged === 1 && (
                <Ionicons
                  name="flag-sharp"
                  size={25}
                  color="#ef893a"
                  style={{ marginLeft: 10 }}
                />
              )}
            </View>

            {(isEditingThis || showAction) && (
              <Pressable onPress={infoButton}>
                <Ionicons
                  name="information-circle-outline"
                  size={27}
                  color="#007AFF"
                />
              </Pressable>
            )}
          </Pressable>
        </Animated.View>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 10,
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
    alignItems: "center",
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0d8d8",
    paddingVertical: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "500",
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

  pressed: {
    width: " 100%",
    opacity: 0.3,
    backgroundColor: "#D8D8D8",
  },

  actionText: {
    color: "white",
    fontWeight: "bold",
  },

  animation: {
    position: "relative",
    zIndex: 1,
  },

  wrapper: {
    position: "relative",
    overflow: "visible",
    marginBottom: 10,
  },

  actionWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 10,
  },

  actionContainer: {
    width: 240,
    height: "100%",
    flexDirection: "row",
    backgroundColor: "transparent",
  },

  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: 80,
    zIndex: 0,
  },

  actionPressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
