import { List } from "models/List";
import { getDB } from "./OpenDB";

export async function initList(): Promise<void> {
  const db = await getDB();
  try {
    await db.execAsync(`
        create table if not exists lists(
            listId text primary key not null,
            name text not null,
            icon text not null,
            color text not null,
            smartList integer not null,
            groupId text,
            foreign key (groupId) references groups(groupId) on delete set null
        )
    `);
  } catch (error: any) {
    throw new Error(`Can not create Database. Error: ${error.message}`);
  }
}

export async function getAllLists(): Promise<List[]> {
  const db = await getDB();
  try {
    const rows = await db.getAllAsync<any>("SELECT * FROM lists");

    const lists: List[] = rows.map((row) => ({
      listId: row.listId.toString() ?? Date.now().toString(),
      name: row.name,
      icon: row.icon,
      color: row.color,
      smartList: row.smartList === 1,
      groupId: row.groupId ?? undefined,
    }));

    return lists;
  } catch (error: any) {
    throw new Error(`Can not load Lists ! Error: ${error.message}`);
  }
}

export async function insertList(list: List): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(
      `
      Insert into lists (listId, name, icon, color, smartList, groupId) values (?, ?,  ?, ?, ?, ?)`,
      [
        list.listId,
        list.name,
        list.icon,
        list.color,
        list.smartList ? 1 : 0,
        list.groupId ?? null,
      ]
    );
  } catch (error: any) {
    throw new Error(`Can not insert List ! Error: ${error.message}`);
  }
}

export async function deleteList(listId: string): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(`delete from lists where listId = ?`, [listId]);
  } catch (error: any) {
    throw new Error(`Can not delete List ! Error: ${error.message}`);
  }
}

export async function updateList(list: List): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(
      `
      UPDATE lists 
      SET name = ?, icon = ?, color = ?, smartList = ?, groupId = ?
      WHERE listId = ?`,
      [
        list.name,
        list.icon,
        list.color,
        list.smartList ? 1 : 0,
        list.groupId ?? null,
        list.listId,
      ]
    );
  } catch (error: any) {
    throw new Error(`Cannot update List! Error: ${error.message}`);
  }
}

export async function updateGroupId(list: List): Promise<void> {
  const db = await getDB();
  try {
    await db.runAsync(
      `
        update lists set groupId = ? where listId = ?`,
      [list.groupId ?? null, list.listId]
    );
  } catch (error: any) {
    throw new Error(`Cannot update GroupId! Error: ${error.message}`);
  }
}

export async function getListsByGroupId(groupId: string): Promise<List[]> {
  const db = await getDB();
  try {
    const rows = await db.getAllAsync<any>(
      `select * from lists where groupId = ?`,
      [groupId]
    );
    const lists: List[] = rows.map((row) => ({
      listId: row.listId,
      name: row.name,
      icon: row.icon,
      color: row.color,
      smartList: row.smartList === 1,
      groupId: row.groupId ?? undefined,
    }));
    return lists;
  } catch (error: any) {
    throw new Error(`Can not load Lists ! Error: ${error.message}`);
  }
}
