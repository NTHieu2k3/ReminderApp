import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGroupContext } from "context/group-context";
import { useListContext } from "context/list-context";
import { insertGroup } from "database/GroupDB";
import { updateGroupId } from "database/ListDB";
import { Group } from "models/Group";
import { List } from "models/List";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewGroup() {
  const [name, setName] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<List[]>([]);

  const navigation = useNavigation();

  const listCtx = useListContext();
  const groupCtx = useGroupContext();

  const unGroupList = useMemo(
    () => listCtx.lists.filter((item) => !item.smartList),
    [listCtx.lists]
  );

  const selectLists = useCallback((list: List) => {
    setSelected((prev) => {
      const exists = prev.find((item) => item.listId === list.listId);
      if (exists) {
        return prev.filter((item) => item.listId !== list.listId);
      }
      return [...prev, list];
    });
  }, []);

  const create = useCallback(async () => {
    if (name.trim() == "") {
      Alert.alert("Warning", "Please enter Group Name");
      return;
    }

    try {
      const id = Date.now().toString();
      const group: Group = { groupId: id, name: name };

      await insertGroup(group);
      groupCtx.addG(group);

      for (const list of selected) {
        await updateGroupId({ ...list, groupId: id });
        listCtx.updateL({ ...list, groupId: id });
      }
      if (Platform.OS === "ios") {
        Alert.alert("Success", "Your group has been created !", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Success", "Saved !");
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert("Warning", `${error.message}`);
    }
  }, [name, selected, groupCtx, listCtx, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "New Group",
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>Cancel</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={() => create()}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>Create</Text>
        </Pressable>
      ),
    });
  }, [create, navigation]);

  const renderItem = useCallback(
    ({ item }: { item: List }) => {
      const isSelected = selected.some((l) => l.listId === item.listId);
      return (
        <TouchableOpacity
          onPress={() => selectLists(item)}
          style={[styles.listItem, isSelected && styles.listItemSelected]}
        >
          <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon} size={20} color="white" />
          </View>
          <Text style={styles.listName}>{item.name}</Text>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
          )}
        </TouchableOpacity>
      );
    },
    [selected, selectLists]
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <TextInput
            style={styles.inputText}
            placeholder="Enter Group Name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.selectContainer,
            pressed && styles.pressed,
          ]}
          onPress={(prev) => setExpanded((prev) => !prev)}
        >
          <Text style={styles.textSelect}>Include</Text>
          <Ionicons
            name={expanded ? "chevron-down" : "chevron-forward"}
            size={20}
            color=""
          />
        </Pressable>
        {expanded && (
          <FlatList
            data={unGroupList}
            keyExtractor={(item) => item.listId}
            renderItem={renderItem}
            contentContainerStyle={styles.listWrapper}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingTop: 24,
  },

  inputContainer: {
    backgroundColor: "#fff",
    marginTop: 40,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 20,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },

  inputText: {
    color: "#1C1C1E",
    fontSize: 18,
  },

  selectContainer: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textSelect: {
    fontSize: 17,
    color: "#1C1C1E",
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#F2F2F7",
  },

  listItemSelected: {
    backgroundColor: "#DCEBFF",
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
    flex: 1,
  },

  listWrapper: {
    backgroundColor: "#fff",
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
  },

  pressed: {
    opacity: 0.5,
    backgroundColor: "#c8c8cb",
  },
});
