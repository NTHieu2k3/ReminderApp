import { List } from "models/List";
import { getDB } from "./OpenDB";

export async function initList(): Promise<void> {
  const db = await getDB();
  try {
    // 1. Tạo bảng
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS lists (
        listId TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        smartList INTEGER NOT NULL,
        groupId TEXT,
        FOREIGN KEY (groupId) REFERENCES groups(groupId) ON DELETE SET NULL
      );
    `);

    const DEFAULT_LISTS: List[] = [
      {
        listId: "all",
        name: "All",
        icon: "apps",
        color: "#5E5CE6",
        smartList: true,
      },
      {
        listId: "today",
        name: "Today",
        icon: "sunny",
        color: "#FF2D55",
        smartList: true,
      },
      {
        listId: "scheduled",
        name: "Scheduled",
        icon: "calendar",
        color: "#FF9500",
        smartList: true,
      },
      {
        listId: "flag",
        name: "Flagged",
        icon: "flag",
        color: "#FFCC00",
        smartList: true,
      },
      {
        listId: "done",
        name: "Done",
        icon: "checkmark",
        color: "#656461",
        smartList: true,
      },
    ];

    const existing = await getAllLists();
    const existingIds = new Set(existing.map((item) => item.listId));

    for (const list of DEFAULT_LISTS) {
      if (!existingIds.has(list.listId)) {
        await insertList(list);
      }
    }
  } catch (error: any) {
    console.error("[initList] Error:", error);
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

export async function updateList(list: List, listId: string): Promise<void> {
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
        listId,
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