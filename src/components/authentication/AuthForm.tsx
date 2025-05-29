import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { User } from "models/User";

interface AuthFormProps {
  readonly isLogin: boolean;
  readonly onToggle: () => void;
  readonly onAuthenticate: (user: User, autoLogin: boolean) => void;
}

export function AuthForm({ isLogin, onToggle, onAuthenticate }: AuthFormProps) {
  const login = isLogin;

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [passRep, setPassRep] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showRepPass, setShowRepPass] = useState(false);

  const [save, setSave] = useState(false);

  function resert() {
    setEmail("");
    setPass("");
    setPassRep("");
    setUsername("");
    onToggle();
  }

  function submitHandler() {
    if (login) {
      if (email.trim() === "" || pass.trim() === "") {
        Alert.alert("Warning", "Email and Password cannot be empty !");
        return;
      }
    } else {
      const emailValid = email.includes("@");
      const passValid = pass.length > 8;
      const passEqual = passRep === pass;

      if (!emailValid || !passValid || !passEqual) {
        Alert.alert("Warning", "Please check your sign-up information!");
        return;
      }
    }

    onAuthenticate({ email, password: pass }, save);
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.row}>
        {login ? (
          <>
            <Pressable>
              <Text style={[styles.tab, login && styles.activeTab]}>Login</Text>
            </Pressable>
            <Pressable
              onPress={resert}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={[styles.tab, !login && styles.activeTab]}>
                Sign Up
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable>
              <Text style={[styles.tab, !login && styles.activeTab]}>
                Sign Up
              </Text>
            </Pressable>
            <Pressable
              onPress={resert}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={[styles.tab, login && styles.activeTab]}>Login</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avtCircle}>
          <Ionicons
            name={login ? "person-circle-outline" : "camera-outline"}
            size={100}
            color="#ccc"
          />
        </View>
      </View>

      {/* Input fields */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
        />
        {!login && (
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputFlex}
            placeholder="Password"
            value={pass}
            onChangeText={setPass}
            secureTextEntry={!showPass}
          />
          <Pressable onPress={() => setShowPass((prev) => !prev)}>
            <Ionicons
              name={showPass ? "eye-outline" : "eye-off-outline"}
              size={25}
              color="#aaa"
            />
          </Pressable>
        </View>

        {login && (
          <View style={styles.rowSave}>
            <Pressable
              onPress={() => setSave((prev) => !prev)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Ionicons
                name={save ? "checkmark-circle-outline" : "ellipse-outline"}
                size={25}
                color={save ? "#5c7bf6" : "#aaa"}
              />
            </Pressable>
            <Text
              style={{
                color: save ? "#5c7bf6" : "#aaa",
                paddingLeft: 5,
                fontSize: 15,
              }}
            >
              Auto login
            </Text>
          </View>
        )}

        {!login && (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputFlex}
              placeholder="Repeat Password"
              value={passRep}
              onChangeText={setPassRep}
              secureTextEntry={!showRepPass}
            />
            <Pressable onPress={() => setShowRepPass((prev) => !prev)}>
              <Ionicons
                name={showRepPass ? "eye-outline" : "eye-off-outline"}
                size={25}
                color="#aaa"
              />
            </Pressable>
          </View>
        )}
      </View>

      {/* Submit button */}
      <Pressable
        onPress={submitHandler}
        style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
      >
        <Text style={styles.submitText}>
          {login ? "✓ LOG IN" : "✓ SIGN UP"}
        </Text>
      </Pressable>

      {/* Social login */}
      {login && (
        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>Login with</Text>
          <View style={styles.socialIcons}>
            <Ionicons name="logo-google" size={50} color="#ea4335" />
            <Ionicons name="logo-github" size={50} color="#000" />
            <Ionicons name="logo-twitter" size={50} color="#1da1f2" />
            <Ionicons name="logo-facebook" size={50} color="#1877f2" />
          </View>
        </View>
      )}

      {/* Terms of Service */}
      {!login && (
        <View style={styles.termsContainer}>
          <Text style={styles.terms}>Terms of Service</Text>
        </View>
      )}
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

  rowSave: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
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

  form: {
    gap: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 20,
    fontSize: 16,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  inputFlex: {
    flex: 1,
    paddingVertical: 20,
    fontSize: 16,
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

  socialContainer: {
    marginTop: 30,
    alignItems: "center",
  },

  socialText: {
    color: "#999",
    marginBottom: 10,
    fontSize: 18,
  },

  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 15,
  },

  termsContainer: {
    marginTop: 30,
    alignItems: "center",
  },

  terms: {
    color: "#999",
    textDecorationLine: "underline",
  },

  pressed: {
    opacity: 0.5,
  },
});
