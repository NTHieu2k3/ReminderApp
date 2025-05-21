import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { updateReminder } from "database/ReminderDB";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { updateReminderThunk } from "store/actions/reminderActions";

export default function ReminderNotificationHandler() {
  const dispatch = useAppDispatch();
  const reminders = useAppSelector((state) => state.reminder.reminders);

  useEffect(() => {
    //Lắng nghe thông báo
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener(async (notification) => {
        const reminderId = notification.request.content.data?.id;
        if (typeof reminderId === "string") {
          const existing = reminders.find((r) => r.id === reminderId);
          if (!existing) return;

          const updated = {
            ...existing,
            status: 1 as const,
          };
          dispatch(updateReminderThunk(updated));
        }
      });

    //Kiểm tra quá hạn
    const checkPendingNotifications = async () => {
      const pendingNotifications =
        await Notifications.getAllScheduledNotificationsAsync();

      for (const notification of pendingNotifications) {
        const reminderId = notification.content.data?.id;
        const triggerDate = (notification.trigger as any)?.date as
          | Date
          | undefined;

        if (typeof reminderId === "string" && triggerDate) {
          const now = new Date();
          if (triggerDate <= now) {
            const existing = reminders.find((r) => r.id === reminderId);
            if (!existing || existing.status === 1) continue;

            const updated = {
              ...existing,
              status: 1 as const,
            };

            dispatch(updateReminderThunk(updated));

            await Notifications.cancelScheduledNotificationAsync(
              notification.identifier
            );
          }
        }
      }
    };

    checkPendingNotifications();

    return () => {
      foregroundSubscription.remove();
    };
  }, [reminders, dispatch]);

  return null;
}
