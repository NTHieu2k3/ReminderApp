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
    const subscription = Notifications.addNotificationReceivedListener(
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

    return () => subscription.remove();
  }, [reminders, updateR]);

  return null;
}
