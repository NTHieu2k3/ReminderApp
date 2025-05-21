import { useNavigation, useRoute } from "@react-navigation/native";
import { LForm } from "components/List";
import { StatusBar } from "expo-status-bar";
import { List } from "models/List";
import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { updateListThunk } from "store/actions/listActions";
import { useAppDispatch, useAppSelector } from "store/hooks";

export default function InfoList() {
  const route = useRoute();
  const navigation = useNavigation();
  const { listId } = route.params as { listId: string };

  const lists = useAppSelector((state) => state.list.lists);
  const dispatch = useAppDispatch();

  const list = lists.find((item) => item.listId === listId);
  const defaultListIds = ["all", "today", "scheduled", "flag", "done"];

  const [formData, setFormData] = useState({
    name: list?.name ?? "",
    color: list?.color ?? "",
    icon: list?.icon ?? "list",
    smartList: false,
  });

  const [isDone, setIsDone] = useState(false);

  const handleSubmit = useCallback(
    async (data: typeof formData) => {
      if (!list) return;
      if (defaultListIds.includes(list.listId)) {
        Alert.alert("Warning", "You cannot update a default list!");
        return;
      }
      if (data.name.trim() === "") {
        Alert.alert("Warning", "Please enter List name");
        return;
      }

      setIsDone(true);
      try {
        const updated: List = {
          listId: list.listId,
          name: data.name,
          color: data.color,
          icon: data.icon,
          smartList: data.smartList ?? false,
          groupId: list.groupId ?? null,
        };

        dispatch(updateListThunk(updated)).unwrap();

        Alert.alert("Success", "Updated!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } catch (error: any) {
        Alert.alert("Error", `Could not update list: ${error.message}`);
      } finally {
        setIsDone(false);
      }
    },
    [list, dispatch, navigation]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Detail List",
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
          onPress={() => handleSubmit(formData)}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>Done</Text>
        </Pressable>
      ),
    });
  }, [handleSubmit, formData, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LForm defaultValue={formData} isSaving={isDone} onChange={setFormData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },

  pressed: {
    opacity: 0.5,
    backgroundColor: "#F2F2F7",
  },
});
