export interface ReminderDetails {
  date?: string;
  time?: string;
  tag?: string;
  location?: string;
  flagged?: string;
  priority?: string;
  photoUri?: string;
  url?: string;
}

export interface Reminder {
  id: string;
  title: string;
  note?: string;
  details: ReminderDetails;
  listId: string;
}
