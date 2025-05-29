import {
  loginAccount,
  refreshTokenThunk,
  signUpAccount,
} from "store/actions/authActions";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthForm } from "components/authentication/AuthForm";
import { getUserInfor } from "database/AuthDB";
import { NameType } from "enums/name-screen.enum";
import { User } from "models/User";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useAppDispatch } from "store/hooks";
import { store } from "store/store";
import { AuthResponse } from "type/authRespone.type";
import { RootStackParam } from "type/navigation.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Authen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const [isLogin, setIsLogin] = useState(true);

  const [autoLogin, setAutoLogin] = useState(false);

  const dispatch = useAppDispatch();

  async function handleAuth(user: User, autoLogin: boolean) {
    try {
      const action = isLogin ? loginAccount(user) : signUpAccount(user);
      const res: AuthResponse = await dispatch(action).unwrap();

      if (autoLogin) {
        await AsyncStorage.setItem("token", res.token);
        await AsyncStorage.setItem("refreshToken", res.refreshToken);
        await AsyncStorage.setItem("uid", res.uid);
        await AsyncStorage.setItem("email", res.email);

        console.log("res.token", res.token);
        console.log("res.refreshToken", res.refreshToken);
        console.log("res.uid", res.uid);
        console.log("res.email", res.email);
      }
      if (isLogin) {
        navigation.navigate(NameType.HOME);
      } else {
        Alert.alert("Successed", "Check your email to verify your account!", [
          { text: "Ok", onPress: () => setIsLogin(true) },
        ]);
      }
    } catch (error: any) {
      const errorMessage =
        error?.payload ??
        error?.message ??
        error?.toString() ??
        "Authentication failed";

      Alert.alert("Authentication Failed", errorMessage);
    }
  }

  useEffect(() => {
    async function tryAutoLogin() {
      // await AsyncStorage.setItem("token","INVALID_ID_TOKEN");

      const token = await AsyncStorage.getItem("token");
      const uid = await AsyncStorage.getItem("uid");
      const email = await AsyncStorage.getItem("email");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!token || !uid || !email) return;
      setAutoLogin(true);
      try {
        await getUserInfor(token);
        navigation.reset({
          index: 0,
          routes: [{ name: NameType.HOME }],
        });
        setAutoLogin(false);
      } catch (error: any) {
        const msg = error?.response?.data?.error?.message;
        if (msg === "INVALID_ID_TOKEN" && refreshToken) {
          setAutoLogin(true);
          try {
            const result = await store
              .dispatch(refreshTokenThunk(refreshToken))
              .unwrap();
            await AsyncStorage.setItem("token", result.token);
            await AsyncStorage.setItem("refreshToken", result.refreshToken);
            navigation.reset({
              index: 0,
              routes: [{ name: NameType.HOME }],
            });
            setAutoLogin(false);
          } catch (error: any) {
            console.log("Refresh failed:", error.message);
          }
        } else {
          console.log("Token unvalivable:", error.message);
        }
      }
    }

    tryAutoLogin();
  }, []);

  if (autoLogin) {
    return <ActivityIndicator size="large" color="#4c6ef5" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <AuthForm
        isLogin={isLogin}
        onAuthenticate={handleAuth}
        onToggle={() => setIsLogin((prev) => !prev)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
