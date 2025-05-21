import { useNavigation } from "@react-navigation/native";
import { LForm } from "components/List";
import { List } from "models/List";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { createListThunk } from "store/actions/listActions";
import { useAppDispatch } from "store/hooks";
import { IoniconsName } from "type/ionicons.type";
export default function NewList() {
  const [isSaving, setIsSaving] = useState(false);

  const navigation = useNavigation();

  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: "",
    color: "#FF3B30",
    icon: "list" as IoniconsName,
    smartList: false,
  });

  const done = useCallback(async () => {
    if (!formData.name.trim()) {
      Alert.alert("Warning", "Please enter List Name");
      return;
    }

    setIsSaving(true);

    try {
      const list: List = {
        listId: Date.now().toString(),
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
        smartList: formData.smartList,
      };

       dispatch(createListThunk(list)).unwrap();

      if (Platform.OS === "ios") {
        Alert.alert("Success", "Your list has been saved successfully!", [
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
      Alert.alert("Warning", `Can not save your list ! ${error}`);
      console.log(error.message);
    } finally {
      setIsSaving(false);
    }
  }, [formData, dispatch, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "New List",
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
          onPress={done}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>Done</Text>
        </Pressable>
      ),
    });
  }, [done, navigation]);

  return (
    <View style={styles.container}>
      <LForm
        defaultValue={formData}
        onChange={setFormData}
        isSaving={isSaving}
      />
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
