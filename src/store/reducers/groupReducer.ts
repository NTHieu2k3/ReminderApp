import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group } from "models/Group";
import {
  createGroupThunk,
  deleteGroupThunk,
  getGroups,
} from "store/actions/groupActions";
interface GroupSliceState {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupSliceState = {
  groups: [],
  loading: false,
  error: null,
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload);
    },
    deleteGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(
        (item) => item.groupId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      //Fetch
      .addCase(getGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Cannot load Your Groups";
      })

      //Add
      .addCase(createGroupThunk.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })

      //Delete
      .addCase(deleteGroupThunk.fulfilled, (state, action) => {
        state.groups = state.groups.filter(
          (item) => item.groupId !== action.payload
        );
      });
  },
});

export const { setGroup, addGroup, deleteGroup } = groupSlice.actions;

export default groupSlice.reducer;
