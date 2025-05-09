import { Group } from "models/Group";
import { getDB } from "./OpenDB";

export async function initGroup(): Promise<void> {
  const db = await getDB();
  try {
    await db.execAsync(`
            create table if not exists groups(
                groupId text primary key not null,
                name text not null
            )`);
  } catch (error: any) {
    throw new Error(`Can not create Database. Error: ${error.message}`);
  }
}

export async function getAllGroups(): Promise<Group[]> {
  const db = await getDB();
  try {
    const rows = await db.getAllAsync<any>("SELECT * FROM groups");
    const results: Group[] = rows.map((row) => ({
      groupId: row.groupId,
      name: row.name,
    }));

    return results;
  } catch (error: any) {
    throw new Error(`Can not get all groups. Error: ${error.message}`);
  }
}

export async function insertGroup(group: Group): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(`INSERT INTO groups (groupId, name) VALUES (?, ?)`, [
      group.groupId,
      group.name,
    ]);
  } catch (error: any) {
    throw new Error(`Can not add group. Error: ${error.message}`);
  }
}

export async function updateGroup(group: Group): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(`UPDATE groups SET name = ? WHERE groupId = ?`, [
      group.name,
      group.groupId,
    ]);
  } catch (error: any) {
    throw new Error(`Can not update group. Error: ${error.message}`);
  }
}

export async function deleteGroup(groupId: string): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(`DELETE FROM groups WHERE groupId = ?`, [groupId]);
  } catch (error: any) {
    throw new Error(`Can not delete group. Error: ${error.message}`);
  }
}
