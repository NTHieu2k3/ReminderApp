import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  deleteListThunk,
  getLists,
  updateListThunk,
} from "store/actions/listActions";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import { LList } from "components/List";
import { GList } from "components/Group";
import { NameType } from "enums/name-screen.enum";
import { RootStackParam } from "type/navigation.type";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { deleteGroupThunk, getGroups } from "store/actions/groupActions";
import { logout } from "store/reducers/authReducers";
import { getReminders } from "store/actions/reminderActions";
import BottomBar from "../layout/BottomBar";
import HeaderMenu from "../layout/HeaderMenu";
import RItem from "components/Reminder/RItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  const dispatch = useAppDispatch();
  const reminders = useAppSelector((state) => state.reminder.reminders);
  const groups = useAppSelector((state) => state.groups.groups);
  const lists = useAppSelector((state) => state.list.lists);

  const [search, setSearch] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditPress = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const filterReminder = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return [];

    return reminders.filter((item) => {
      const title = item.title.toLowerCase() ?? "";
      const note = item.note?.toLowerCase() ?? "";

      return title.includes(keyword) || note.includes(keyword);
    });
  }, [search, reminders]);

  function handleLogout() {
    dispatch(logout());
    AsyncStorage.multiRemove(["token", "uid", "email"]);
    navigation.reset({
      index: 0,
      routes: [{ name: NameType.AUTHEN }],
    });
  }


  
  const menuItems = useMemo(
    () => [
      {
        title: "Edit",
        icon: "pencil-outline" as const,
        onPress: () => setIsEditMode(true),
      },
      {
        title: "Logout",
        icon: "log-out-outline" as const,
        onPress: handleLogout,
      },
    ],
    [handleEditPress]
  );

  useFocusEffect(
    useCallback(() => {
      async function fetch() {
        try {
          dispatch(getGroups());
          dispatch(getLists());
          dispatch(getReminders());
        } catch (error: any) {
          Alert.alert("Warning", `${error}`);
        }
      }
      fetch();
    }, [dispatch])
  );

  const DeleteListHandle = useCallback(
    (listId: string) => {
      try {
        if (
          listId !== "all" &&
          listId !== "flag" &&
          listId !== "scheduled" &&
          listId !== "today" &&
          listId !== "done"
        ) {
          dispatch(deleteListThunk(listId));
        } else {
          Alert.alert("Warning", "You can not delete default list !");
        }
      } catch (error: any) {
        Alert.alert("Warning", `${error.message}`);
      }
    },
    [dispatch]
  );

  const DeleteGroupHandle = useCallback(
    async (groupId: string) => {
      try {
        const lGId = lists.filter((item) => item.groupId === groupId);
        for (const item of lGId) {
          dispatch(updateListThunk({ ...item, groupId: null }));
        }
        dispatch(deleteGroupThunk(groupId));
      } catch (error: any) {
        Alert.alert("Warning", `${error.message}`);
      }
    },
    [dispatch]
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderMenu
        menuItems={menuItems}
        isEditMode={isEditMode}
        toggleEditMode={() => setIsEditMode(false)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#8E8E93"
            style={{ marginLeft: 8 }}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#8E8E93"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons
            name="mic"
            size={18}
            color="#8E8E93"
            style={{ marginRight: 8 }}
          />
        </View>
        {filterReminder.length > 0 ? (
          filterReminder.map((reminder) => (
            <RItem key={reminder.id} reminder={reminder} />
          ))
        ) : (
          <>
            <LList
              lists={lists}
              reminder={reminders}
              isEditMode={isEditMode}
              onDelete={(item) => DeleteListHandle(item.listId)}
              onPressItem={(item) => {
                navigation.navigate(NameType.DETAILLIST, {
                  listId: item.listId,
                });
              }}
            />
            <GList
              groups={groups}
              lists={lists}
              reminders={reminders}
              isEditMode={isEditMode}
              onDelete={(item) => DeleteGroupHandle(item.groupId)}
              onPressItem={(l) =>
                navigation.navigate(NameType.DETAILLIST, { listId: l.listId })
              }
              onDeleteItem={(item) => DeleteListHandle(item.listId)}
            />
          </>
        )}
      </ScrollView>
      <BottomBar
        showLeftButton={true}
        showRightButton={true}
        isEditMode={isEditMode}
        onLeftPress={() => {
          if (isEditMode) {
            navigation.navigate(NameType.NEWGROUP);
          } else {
            navigation.navigate(NameType.NEWREMINDER);
          }
        }}
        onRightPress={() => {
          navigation.navigate(NameType.NEWLIST);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingTop: 40,
  },

  scrollContent: {
    paddingBottom: 80,
    paddingHorizontal: 16,
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1D1D6",
    borderRadius: 12,
    height: 40,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    marginHorizontal: 8,
  },
});
