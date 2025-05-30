import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NameType } from "enums/name-screen.enum";
import { useState } from "react";
import { forgotPasswordThunk } from "store/actions/authActions";
import { useAppDispatch } from "store/hooks";
import { RootStackParam } from "type/navigation.type";

export default function ForgotPassword() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  const [email, setEmail] = useState("");

  const dispatch = useAppDispatch();

  async function submit() {
    if (email.trim() === "") {
      Alert.alert(
        "Warning",
        "Please enter your email to receive verification code !"
      );
    }
    try {
      await dispatch(forgotPasswordThunk(email));
      Alert.alert("Successed", "Check your email to reset your password !", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Warning", `Failed: ${error.message}`);
      console.log(error.message);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable>
          <Text style={[styles.tab, styles.activeTab]}>Verify</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => pressed && styles.pressed}
          onPress={() => navigation.navigate(NameType.AUTHEN)}
        >
          <Text style={[styles.tab]}>Authenticate</Text>
        </Pressable>
      </View>
      <View style={styles.avatarContainer}>
        <View style={styles.avtCircle}>
          <Ionicons name="construct-outline" color="#ccc" size={100} />
        </View>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
        />
        <Pressable
          onPress={submit}
          style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
        >
          <Text style={styles.submitText}>SEND EMAIL VERIFICATION</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    height: "100%",
    flex: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 20,
    fontSize: 16,
  },

  avatarContainer: {
    alignItems: "center",
    marginVertical: 40,
  },

  avtCircle: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ccc",
  },

  submitBtn: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  submitText: {
    color: "#4c6ef5",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },

  tab: {
    fontSize: 20,
    color: "#b5b5bc",
    fontWeight: "bold",
  },

  activeTab: {
    color: "black",
    fontSize: 35,
  },

  form: {
    gap: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },

  pressed: {
    opacity: 0.5,
  },
});
