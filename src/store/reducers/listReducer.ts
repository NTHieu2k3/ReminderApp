import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { List } from "models/List";
import {
  createListThunk,
  deleteListThunk,
  getLists,
  updateListThunk,
} from "store/actions/listActions";

interface ListSliceState {
  lists: List[];
  loading: boolean;
  error: string | null;
}

const initialState: ListSliceState = {
  lists: [],
  loading: false,
  error: null,
};

export const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setList: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
    },
    addList: (state, action: PayloadAction<List>) => {
      state.lists.push(action.payload);
    },
    updateList: (state, action: PayloadAction<List>) => {
      const index = state.lists.findIndex(
        (item) => item.listId === action.payload.listId
      );

      if (index !== -1) {
        state.lists[index] = action.payload;
      }
    },
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter(
        (item) => item.listId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      //Fetch
      .addCase(getLists.fulfilled, (state, action) => {
        state.lists = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Cannot load Your Lists";
      })

      //Create
      .addCase(createListThunk.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })

      //Update
      .addCase(updateListThunk.fulfilled, (state, action) => {
        const index = state.lists.findIndex(
          (item) => item.listId === action.payload.listId
        );

        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })

      //Delete
      .addCase(deleteListThunk.fulfilled, (state, action) => {
        state.lists = state.lists.filter(
          (item) => item.listId !== action.payload
        );
      });
  },
});

export const { setList, addList, updateList, deleteList } = listSlice.actions;
export default listSlice.reducer;

