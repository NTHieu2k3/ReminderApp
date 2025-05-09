import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LList from "../components/List/LList";
import { useListContext } from "../context/list-context";
import { deleteList, getAllLists } from "../database/ListDB";
import BottomBar from "../layout/BottomBar";
import HeaderMenu from "../layout/HeaderMenu";
import { useCallback, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type RootStackParam = {
  Home: undefined;
  NewList: undefined;
  NewGroup: undefined;
};

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  const { lists, deleteL, setL } = useListContext();
  const menuItems = [{ title: "Edit", onPress: () => setIsEditMode(true) }];
  const [isEditMode, setIsEditMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchLists() {
        try {
          const data = await getAllLists();
          setL(data);
        } catch (error: any) {
          Alert.alert("Warning", `${error}`);
        }
      }
      fetchLists();
    }, [setL])
  );

  async function DeleteHandle(listId: string) {
    try {
      await deleteList(listId);
      deleteL(listId);
    } catch (error: any) {
      Alert.alert("Warning", `${error.message}`);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderMenu
        menuItems={menuItems}
        isEditMode={isEditMode}
        toggleEditMode={() => setIsEditMode(false)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchContainer}>
          <View style={styles.row}>
            <Ionicons name="search-outline" size={20} color="#aaaaae" />
            <TextInput placeholder="Search" />
          </View>
          <Ionicons name="mic" size={20} color="#aaaaae" />
        </View>
        <LList
          lists={lists}
          isEditMode={isEditMode}
          onDelete={(item) => DeleteHandle(item.listId)}
          onPressItem={(item) => {
            console.log("List:", item.name);
          }}
        />
      </ScrollView>
      <BottomBar
        showLeftButton={true}
        showRightButton={true}
        isEditMode={isEditMode}
        onLeftPress={() => {
          if (isEditMode) {
            navigation.navigate("NewGroup");
          }
        }}
        onRightPress={() => {
          navigation.navigate("NewList");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },

  searchContainer: {
    backgroundColor: "#d4d4dc",
    width: "90%",
    height: 40,
    borderRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 30,
    paddingHorizontal: 5,
  },

  row: {
    flexDirection: "row",
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 50,
    padding: 10,
  },

  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
});
