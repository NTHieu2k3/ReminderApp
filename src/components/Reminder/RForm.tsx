import { Ionicons } from "@expo/vector-icons";
import { useReminderForm } from "hooks";
import { List } from "models/List";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { DetailReminder } from "utils";

interface ReminderFormProps {
  readonly lists: List[];
  readonly form: ReturnType<typeof useReminderForm>;
  readonly forceShowDetails?: boolean;
}

export default function RForm({
  lists,
  form,
  forceShowDetails,
}: ReminderFormProps) {
  const {
    title,
    setTitle,
    notes,
    setNotes,
    selectedList,
    setSelectedList,
    expanded,
    setExpanded,
    isDetail,
    setIsDetail,
    date,
    time,
    location,
    priority,
    tag,
    flag,
    messaging,
    image,
    setImage,
    url,
    setUrl,
  } = form;

  function form1() {
    return (
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

          {forceShowDetails && (
            <TextInput
              placeholder="URL"
              value={url}
              onChangeText={(text) => setUrl(text)}
              style={styles.input2}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
        </View>
        {!forceShowDetails && (
          <View>
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
                      style={[
                        styles.iconCircle,
                        { backgroundColor: item.color },
                      ]}
                    >
                      <Ionicons name={item.icon} size={20} color="white" />
                    </View>
                    <Text style={styles.listName}>{item.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </>
    );
  }

  function form2() {
    return (
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

        {!forceShowDetails && (
          <View style={styles.urlContainer}>
            <TextInput
              placeholder="URL"
              value={url}
              onChangeText={setUrl}
              style={styles.input2}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {forceShowDetails && <View>{form1()}</View>}

      {!isDetail && !forceShowDetails ? form1() : form2()}
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
    backgroundColor: "#fff",
  },

  input2: {
    fontSize: 18,
    color: "#1C1C1E",
    height: 50,
    paddingBottom: 6,
    backgroundColor: "#fff",
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

  urlContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    height: 70,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: "center",
  },
});
