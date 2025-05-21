import { Reminder } from "models/Reminder";

export default function smartFilter(
  reminders: Reminder[],
  listId: string
): Reminder[] {
  const today = new Date().toLocaleDateString();

  switch (listId) {
    case "all":
      return reminders;
    case "today":
      return reminders.filter((item) => item.details.date === today);
    case "scheduled":
      return reminders.filter((item) => item.details.date ?? item.details.time);
    case "flag":
      return reminders.filter((item) => item.details.flagged === 1);
    case "done":
      return reminders.filter((item) => item.status === 1);
    default:
      return reminders.filter((item) => item.listId === listId);
  }
}
