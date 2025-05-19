import { Reminder } from "models/Reminder";
import { getDB } from "./OpenDB";

export async function initReminder(): Promise<void> {
  const db = await getDB();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        note TEXT,
        date TEXT,
        time TEXT,
        tag TEXT,
        location INTEGER,   -- boolean (0 | 1)
        flagged INTEGER,    -- boolean (0 | 1)
        messaging INTEGER,  -- boolean (0 | 1)
        priority TEXT,
        photoUri TEXT,
        url TEXT,
        listId TEXT NOT NULL,
        status INTEGER DEFAULT 0,
        FOREIGN KEY (listId) REFERENCES lists(listId) ON DELETE CASCADE
      )
    `);
  } catch (error: any) {
    throw new Error(`Can not create Database. Error: ${error.message}`);
  }
}

export async function getAllReminders(): Promise<Reminder[]> {
  const db = await getDB();
  try {
    const rows = await db.getAllAsync<any>("SELECT * FROM reminders");
    const results: Reminder[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      note: row.note ?? undefined,
      details: {
        date: row.date ?? undefined,
        time: row.time ?? undefined,
        tag: row.tag ? JSON.parse(row.tag) : "",
        location: row.location === 1 ? 1 : 0,
        flagged: row.flagged === 1 ? 1 : 0,
        messaging: row.messaging === 1 ? 1 : 0,
        priority: row.priority ?? undefined,
        photoUri: row.photoUri ?? undefined,
        url: row.url ?? undefined,
      },
      listId: row.listId,
      status: row.status ?? 0,
    }));
    return results;
  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
}

export async function insertReminder(reminder: Reminder): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(
      `INSERT INTO reminders (id, title, note, date, time, tag, location, flagged, messaging, priority, photoUri, url, listId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reminder.id,
        reminder.title,
        reminder.note ?? null,
        reminder.details.date ?? null,
        reminder.details.time ?? null,
        JSON.stringify(reminder.details.tag) ?? null,
        reminder.details.location ?? 0,
        reminder.details.flagged ?? 0,
        reminder.details.messaging ?? 0,
        reminder.details.priority ?? null,
        reminder.details.photoUri ?? null,
        reminder.details.url ?? null,
        reminder.listId,
        reminder.status ?? 0,
      ]
    );
  } catch (error: any) {
    throw new Error(`Can not insert Reminder! Error: ${error.message}`);
  }
}

export async function updateReminder(
  reminder: Reminder,
  id: string
): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(
      `
      UPDATE reminders 
      SET title = ?, note = ?, date = ?, time = ?, tag = ?, location = ?, flagged = ?, messaging = ?, priority = ?, photoUri = ?, url = ?, listId = ?, status = ?
      WHERE id = ?`,
      [
        reminder.title,
        reminder.note ?? null,
        reminder.details.date ?? null,
        reminder.details.time ?? null,
        JSON.stringify(reminder.details.tag) ?? null,
        reminder.details.location ?? 0,
        reminder.details.flagged ?? 0,
        reminder.details.messaging ?? 0,
        reminder.details.priority ?? null,
        reminder.details.photoUri ?? null,
        reminder.details.url ?? null,
        reminder.listId,
        reminder.status ?? 0,
        id,
      ]
    );
  } catch (error: any) {
    throw new Error(`Can not update Reminder! Error: ${error.message}`);
  }
}

export async function deleteReminder(id: string): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(`DELETE FROM reminders WHERE id = ?`, [id]);
  } catch (error: any) {
    throw new Error(`Can not delete Reminder! Error: ${error.message}`);
  }
}

export async function deleteAllReminders(): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(`DELETE FROM reminders`);
  } catch (error: any) {
    throw new Error(`Can not delete all Reminders! Error: ${error.message}`);
  }
}

export async function deleteAllRemindersByListId(
  listId: string
): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(`DELETE FROM reminders WHERE listId = ?`, [listId]);
  } catch (error: any) {
    throw new Error(
      `Can not delete all Reminders by ListId! Error: ${error.message}`
    );
  }
}
