import * as Notifications from "expo-notifications";

export default async function scheduleReminderNotification(
  reminderId: string,
  title: string,
  dateTime: Date
) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reminder App",
      body: title,
      data: { id: reminderId },
    },
    trigger: dateTime as unknown as Notifications.NotificationTriggerInput,
  });
}
