import axios from "axios";

interface ExpoPushToken {
  data: string;
}

async function sendPushNow(
  expoPushToken: string,
  reminderId: string,
  title: string
) {
  const mesageBody = {
    to: expoPushToken,
    title: "ReminderApp",
    body: title,
    data: { id: reminderId },
  };
  try {
    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      mesageBody,
      {
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Push notification sent successfully:");
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("Failed to send push notification:");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log("Error message:", error.message);
    }
    throw error;
  }
}

export default async function scheduleReminderNotification(
  reminderId: string,
  title: string,
  dateTime: Date,
  expoPushToken: string
) {
  const now = new Date();
  const delayMs = dateTime.getTime() - now.getTime();

  if (delayMs <= 0) {
    return await sendPushNow(expoPushToken, reminderId, title);
  } else {
    setTimeout(() => {
      sendPushNow(expoPushToken, reminderId, title).catch(console.error);
    }, delayMs);
  }
}
