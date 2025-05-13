import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useListContext } from "context/list-context";
import { List } from "models/List";
import { useLayoutEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DetailReminder, useToggleableDetail, useToggleSwitch } from "utils";

type RootStackParam = {
  DetailReminder: undefined;
};

export default function NewReminder() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [expanded, setExpanded] = useState(false);

  const [selectedList, setSelectedList] = useState<List | null>(null);

  const date = useToggleableDetail("", false);
  const time = useToggleableDetail("", false);
  const location = useToggleSwitch(false);
  const priority = useToggleableDetail("", false);
  const messaging = useToggleSwitch(false);
  const flag = useToggleSwitch(false);
  const tag = useToggleableDetail("", false);
  const [image, setImage] = useState("");

  const listCtx = useListContext();

  const lists = listCtx.lists.filter((item) => !item.smartList);

  const [isDetail, setIsDetail] = useState(false);

  function save() {
    const reminder = {
      listId: selectedList?.listId ?? "",
      title,
      notes,
      date: date.value,
      time: time.value,
      location: location.enabled,
      priority: priority.value,
      messaging: messaging.enabled,
      flag: flag.enabled,
      tag: tag.value,
      image,
    };
    console.log("Reminder object to save:", reminder);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "New Reminder",
      headerLeft: () => (
        <Pressable
          onPress={() => {
            if (!isDetail) setIsDetail(false);
            else navigation.goBack();
          }}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>Cancel</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={() => save()}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>Save</Text>
        </Pressable>
      ),
    });
  }, [navigation]);
  return (
    <ScrollView style={styles.container}>
      {!isDetail ? (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={(title) => setTitle(title)}
              style={styles.input1}
            />
            <TextInput
              placeholder="Notes"
              value={notes}
              onChangeText={(notes) => setNotes(notes)}
              style={styles.input2}
            />
          </View>

          <Pressable
            onPress={() => setIsDetail(true)}
            style={({ pressed }) => [
              styles.detailContainer,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.text}>Details</Text>
            <Ionicons name="chevron-forward" size={25} color="#d6d6de" />
          </Pressable>
          <Pressable
            onPress={() => setExpanded((prev) => !prev)}
            style={({ pressed }) => [
              styles.selectContainer,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.text}>List</Text>
            <View style={styles.selectButton}>
              <Text
                style={[
                  styles.textSelect,
                  { color: selectedList ? "blue" : "8E8E93" },
                ]}
              >
                {selectedList?.name ?? "Select List"}
              </Text>
              <Ionicons
                name={expanded ? "chevron-down" : "chevron-forward"}
                size={25}
                color="#d6d6de"
              />
            </View>
          </Pressable>
          {expanded && (
            <View style={styles.listWrapper}>
              {lists.map((item) => (
                <Pressable
                  key={item.listId}
                  style={({ pressed }) => [
                    styles.listItem,
                    pressed && { backgroundColor: "#E5E5EA" },
                  ]}
                  onPress={() => {
                    setSelectedList(item);
                  }}
                >
                  <View
                    style={[styles.iconCircle, { backgroundColor: item.color }]}
                  >
                    <Ionicons name={item.icon} size={20} color="white" />
                  </View>
                  <Text style={styles.listName}>{item.name}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </>
      ) : (
        <View>
          <DetailReminder
            type="date"
            title="Date"
            value={date.value}
            enabled={date.enabled}
            onToggleEnabled={date.toggle}
            onChange={date.set}
          />

          <DetailReminder
            type="time"
            title="Time"
            value={time.value}
            onChange={time.set}
            enabled={time.enabled}
            onToggleEnabled={time.toggle}
          />

          <DetailReminder
            type="priority"
            title="Priority"
            value={priority.value}
            onChange={priority.set}
          />

          <DetailReminder
            type="location"
            title="Location"
            enabled={location.enabled}
            onToggleEnabled={location.toggle}
          />

          <DetailReminder
            type="tags"
            title="Tags"
            value={tag.value}
            onChange={tag.set}
          />

          <DetailReminder
            type="whenMessaging"
            title="When Messaging"
            enabled={messaging.enabled}
            onToggleEnabled={messaging.toggle}
          />

          <DetailReminder
            type="flag"
            title="Flag"
            enabled={flag.enabled}
            onToggleEnabled={flag.toggle}
          />

          <DetailReminder
            type="addImage"
            title="Add Image"
            value={image}
            onChange={setImage}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },

  input1: {
    fontSize: 18,
    color: "#1C1C1E",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    paddingBottom: 6,
    height: 50,
  },

  input2: {
    fontSize: 18,
    color: "#1C1C1E",
    height: 50,
    paddingBottom: 6,
  },

  detailContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    marginBottom: 12,
  },

  selectContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
  },

  selectButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  text: {
    fontSize: 17,
    color: "#1C1C1E",
    fontWeight: "500",
  },

  textSelect: {
    fontSize: 17,
    marginRight: 6,
  },

  pressed: {
    opacity: 0.7,
  },

  listWrapper: {
    backgroundColor: "#fff",
    marginTop: 6,
    borderRadius: 12,
    overflow: "hidden",
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },

  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  listName: {
    fontSize: 16,
    color: "#1C1C1E",
  },

  detailItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
