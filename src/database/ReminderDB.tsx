import { Reminder } from "models/Reminder";
import { getDB } from "./OpenDB";

export async function initReminder(): Promise<void> {
  const db = await getDB();
  try {
    await db.execAsync(`
        Create table if not exists reminders(
            id text primary key not null,
            title text not null,
            note text,
            date text, 
            time text,
            tag text,
            location text,
            flagged integer,
            priority text,
            photoUri text,
            url text,
            listId text not null,
            foreign key (listId) references lists(listId) on delete cascade
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
        date: row.date ? new Date(row.date) : undefined,
        time: row.time ?? undefined,
        tag: row.tag ? JSON.parse(row.tag) : [],
        location: row.location ?? undefined,
        flagged: row.flagged === 1,
        priority: row.priority ?? undefined,
        photoUri: row.photoUri ?? undefined,
        url: row.url ?? undefined,
      },
      listId: row.listId,
    }));
    return results;
  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
}

export async function addReminder(reminder: Reminder): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(
      `INSERT INTO reminders (id, title, note, date, time, tag, location, flagged, priority, photoUri, url, listId) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reminder.id,
        reminder.title,
        reminder.note ?? null,
        reminder.details.date?.toISOString() ?? null,
        reminder.details.time ?? null,
        JSON.stringify(reminder.details.tag) ?? null,
        reminder.details.location ?? null,
        reminder.details.flagged ? 1 : 0,
        reminder.details.priority ?? null,
        reminder.details.photoUri ?? null,
        reminder.details.url ?? null,
        reminder.listId,
      ]
    );
  } catch (error: any) {
    throw new Error(`Can not insert Reminder ! Error: ${error.message}`);
  }
}

export async function deleteReminder(id: string): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(`delete from reminders where id = ?`, [id]);
  } catch (error: any) {
    throw new Error(`Can not delete Reminder ! Error: ${error.message}`);
  }
}

export async function updateReminder(reminder: Reminder): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(
      `
      UPDATE reminders 
      SET title = ?, note = ?, date = ?, time = ?, tag = ?, location = ?, flagged = ?, priority = ?, photoUri = ?, url = ?,
      listId = ?
      WHERE id = ?`,
      [
        reminder.title,
        reminder.note ?? null,
        reminder.details.date?.toISOString() ?? null,
        reminder.details.time ?? null,
        JSON.stringify(reminder.details.tag) ?? null,
        reminder.details.location ?? null,
        reminder.details.flagged ? 1 : 0,
        reminder.details.priority ?? null,
        reminder.details.photoUri ?? null,
        reminder.details.url ?? null,
        reminder.listId,
        reminder.id,
      ]
    );
  } catch (error: any) {
    throw new Error(`Can not update Reminder ! Error: ${error.message}`);
  }
}

export async function deleteAllReminders(): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(`delete from reminders`);
  } catch (error: any) {
    throw new Error(`Can not delete all Reminders ! Error: ${error.message}`);
  }
}

export async function deleteAllRemindersByListId(
  listId: string
): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(`delete from reminders where listId = ?`, [listId]);
  } catch (error: any) {
    throw new Error(
      `Can not delete all Reminders by ListId ! Error: ${error.message}`
    );
  }
}
export async function searchReminders(keyword: string): Promise<Reminder[]> {
  const db = await getDB();
  try {
    const rows = await db.getAllAsync<any>(
      `SELECT * FROM reminders WHERE title LIKE ? OR note LIKE ? OR tag LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    const results: Reminder[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      note: row.note ?? undefined,
      details: {
        date: row.date ? new Date(row.date) : undefined,
        time: row.time ?? undefined,
        tag: row.tag ? JSON.parse(row.tag) : [],
        location: row.location ?? undefined,
        flagged: row.flagged === 1,
        priority: row.priority ?? undefined,
        photoUri: row.photoUri ?? undefined,
        url: row.url ?? undefined,
      },
      listId: row.listId,
    }));
    return results;
  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
}
