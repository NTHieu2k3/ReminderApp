import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteList,
  getAllLists,
  insertList,
  updateList,
} from "database/ListDB";
import { List } from "models/List";

export const getLists = createAsyncThunk("list/getAll", async () => {
  const lists = await getAllLists();
  return lists;
});

export const createListThunk = createAsyncThunk(
  "list/create",
  async (list: List) => {
    await insertList(list);
    return list;
  }
);

export const updateListThunk = createAsyncThunk(
  "list/update",
  async (list: List) => {
    await updateList(list, list.listId);
    return list;
  }
);

export const deleteListThunk = createAsyncThunk(
  "list/delete",
  async (listId: string) => {
    await deleteList(listId);
    return listId;
  }
);
