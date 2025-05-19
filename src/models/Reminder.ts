type BooleanNumber = 0 | 1;

export interface ReminderDetails {
  date?: string;
  time?: string;
  tag?: string;
  location?: BooleanNumber;
  flagged?: BooleanNumber;
  messaging?: BooleanNumber;
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
  status?: 0 | 1;
}
