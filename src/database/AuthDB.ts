import axios from "axios";
import axiosInstance from "utils/axiosInstance";

const API_KEY = "AIzaSyAyPajlOqSi_XX9BYOUUUAUMzKCTs5JQC4";

async function sendEmailVerify(idToken: string) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;
  await axios.post(url, {
    requestType: "VERIFY_EMAIL",
    idToken: idToken,
  });
}

export async function getUserInfor(idToken: string) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`;
  const response = await axiosInstance.post(url, {
    idToken: idToken,
  });
  return response.data.users[0];
}

export async function authenticate(
  mode: string,
  email: string,
  password: string
) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  const response = await axios.post(url, {
    email,
    password,
    returnSecureToken: true,
  });

  const token = response.data.idToken;
  const uid = response.data.localId;
  const refreshToken = response.data.refreshToken;

  if (mode === "signUp") {
    await sendEmailVerify(token);
  }

  if (mode === "signInWithPassword") {
    const user = await getUserInfor(token);
    if (!user.emailVerified) {
      throw new Error("Please verify your email !");
    }
  }
  return { token, uid, email, refreshToken };
}

export async function login(email: string, password: string) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  const response = await axios.post(url, {
    email,
    password,
    returnSecureToken: true,
  });

  const { idToken, refreshToken, localId } = response.data;

  const user = await getUserInfor(idToken);
  if (!user.emailVerified) {
    throw new Error("Please verify your email before login!");
  }
  return { token: idToken, refreshToken, uid: localId, email };
}

export async function refreshIdToken(refreshToken: string) {
  const url = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`;
  const response = await axios.post(url, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  return {
    token: response.data.id_token,
    refreshToken: response.data.refresh_token,
    uid: response.data.user_id,
  };
}

export function signUp(email: string, password: string) {
  return authenticate("signUp", email, password);
}
