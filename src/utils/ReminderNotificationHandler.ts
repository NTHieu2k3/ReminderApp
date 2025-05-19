import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { updateReminder } from "database/ReminderDB";
import { Reminder } from "models/Reminder";

interface Props {
  reminders: Reminder[];
  updateR: (reminder: Reminder) => void;
}

export default function ReminderNotificationHandler({
  reminders,
  updateR,
}: Props) {
  useEffect(() => {
    // Handle received notifications (when app is in foreground)
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const reminderId = notification.request.content.data?.id;
        if (typeof reminderId === "string") {
          const existing = reminders.find((r) => r.id === reminderId);
          if (!existing) return;

          const updated = {
            ...existing,
            status: 1 as const,
          };

          await updateReminder(updated, reminderId);
          updateR(updated);
        }
      }
    );

    // Handle notification responses (when user taps notification)
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const reminderId = response.notification.request.content.data?.id;
        if (typeof reminderId === "string") {
          const existing = reminders.find((r) => r.id === reminderId);
          if (!existing) return;

          const updated = {
            ...existing,
            status: 1 as const,
          };

          await updateReminder(updated, reminderId);
          updateR(updated);
        }
      }
    );

    const checkPendingNotifications = async () => {
      const pendingNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of pendingNotifications) {
        const reminderId = notification.content.data?.id;
        const triggerDate = (notification.trigger as any)?.date as Date | undefined;
        
        if (typeof reminderId === "string" && triggerDate) {
          const now = new Date();
          if (triggerDate <= now) {
            const existing = reminders.find((r) => r.id === reminderId);
            if (!existing || existing.status === 1) continue;

            const updated = {
              ...existing,
              status: 1 as const,
            };

            await updateReminder(updated, reminderId);
            updateR(updated);

            // Cancel the overdue notification
            await Notifications.cancelScheduledNotificationAsync(notification.identifier);
          }
        }
      }
    };

    checkPendingNotifications();

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, [reminders, updateR]);

  return null;
}