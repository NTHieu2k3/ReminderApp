export interface ReminderDetails {
  date?: Date;
  time?: string;
  tag?: string[];
  location?: string;
  flagged?: boolean;
  priority?: "None" | "Low" | "Medium" | "High";
  photoUri?: string;
  url?: string;
}

export interface Reminder {
  id: string;
  title: string;
  note?: string;
  details: ReminderDetails;
  listId: string
}
