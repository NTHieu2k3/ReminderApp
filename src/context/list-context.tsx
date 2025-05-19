import { typeCtx } from "enums/type-ctx.enum";
import { List } from "models/List";
import { createContext, useContext, useMemo, useReducer } from "react";

type Action =
  | { type: typeCtx.GET_ALL; payload: List[] }
  | { type: typeCtx.ADD; payload: List }
  | { type: typeCtx.UPDATE; payload: List }
  | { type: typeCtx.DELETE; payload: string };

function listReducer(state: List[], action: Action): List[] {
  switch (action.type) {
    case typeCtx.GET_ALL:
      return action.payload;
    case typeCtx.ADD:
      return [...state, action.payload];
    case typeCtx.UPDATE:
      return state.map((list) =>
        list.listId === action.payload.listId ? action.payload : list
      );
    case typeCtx.DELETE:
      return state.filter((list) => list.listId !== action.payload);
    default:
      return state;
  }
}

interface ListContextValue {
  lists: List[];
  setL: (list: List[]) => void;
  addL: (list: List) => void;
  updateL: (list: List) => void;
  deleteL: (listId: string) => void;
}

const ListContext = createContext<ListContextValue | undefined>(undefined);

interface Props {
  readonly children: React.ReactNode;
}

export default function ListProvider({ children }: Props) {
  const [lists, dispatch] = useReducer(listReducer, []);

  function setL(list: List[]) {
    dispatch({ type: typeCtx.GET_ALL, payload: list });
  }

  function addL(list: List) {
    dispatch({ type: typeCtx.ADD, payload: list });
  }

  function updateL(list: List) {
    dispatch({ type: typeCtx.UPDATE, payload: list });
  }

  function deleteL(listId: string) {
    dispatch({ type: typeCtx.DELETE, payload: listId });
  }

  const listValue = useMemo(
    () => ({
      lists,
      setL,
      addL,
      updateL,
      deleteL,
    }),
    [lists]
  );
  return (
    <ListContext.Provider value={listValue}>{children}</ListContext.Provider>
  );
}

export function useListContext() {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error("useListContext must be used within a ListProvider");
  }
  return context;
}
