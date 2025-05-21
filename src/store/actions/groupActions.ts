import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllGroups, insertGroup, deleteGroup } from "database/GroupDB";
import { Group } from "models/Group";

export const getGroups = createAsyncThunk("group/getAll", async () => {
  const groups = await getAllGroups();
  return groups;
});

export const createGroupThunk = createAsyncThunk(
  "group/create",
  async (group: Group) => {
    await insertGroup(group);
    return group;
  }
);

export const deleteGroupThunk = createAsyncThunk(
  "group/delete",
  async (groupId: string) => {
    await deleteGroup(groupId);
    return groupId;
  }
);
