import { useEffect } from "react";
import { useReminderContext } from "context/reminder-context";
import { updateReminder } from "database/ReminderDB";

export default function UpdateStatus() {
  const reminderCtx = useReminderContext();

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      now.setSeconds(0, 0);

      console.log(now);
      const overdueReminders = reminderCtx.reminders.filter((r) => {
        const dateStr = r.details.date;
        const timeStr = r.details.time;
        if (!dateStr || !timeStr || r.status === 1) return false;

        const [day, month, year] = dateStr.split("/").map(Number);
        const [hour, minute] = timeStr.split(":").map(Number);
        
        const fullDate = new Date(year, month - 1, day, hour, minute);
        fullDate.setSeconds(0, 0);

        if (isNaN(fullDate.getTime())) return false;
        console.log("⏰ Checking:", r.id, r.details.date, r.details.time);

        return fullDate.getTime() <= now.getTime();
      });

      for (const reminder of overdueReminders) {
        const updated = { ...reminder, status: 1 as const };
        await updateReminder(updated, reminder.id);
        reminderCtx.updateR(updated);
      }
    }, 30000); // Kiểm tra mỗi 60 giây

    return () => clearInterval(interval);
  }, [reminderCtx.reminders]);

  return null;
}
