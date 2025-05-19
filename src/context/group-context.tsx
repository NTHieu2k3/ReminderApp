import { Group } from "models/Group";
import { createContext, useContext, useMemo, useReducer } from "react";
import { typeCtx } from "../enums/type-ctx.enum";

type Action =
  | { type: typeCtx.GET_ALL; payload: Group[] }
  | { type: typeCtx.ADD; payload: Group }
  | { type: typeCtx.UPDATE; payload: Group }
  | { type: typeCtx.DELETE; payload: string };

function groupReducer(state: Group[], action: Action): Group[] {
  switch (action.type) {
    case typeCtx.GET_ALL:
      return action.payload;
    case typeCtx.ADD:
      return [...state, action.payload];
    case typeCtx.UPDATE:
      return state.map((group) =>
        group.groupId === action.payload.groupId ? action.payload : group
      );
    case typeCtx.DELETE:
      return state.filter((group) => group.groupId !== action.payload);
    default:
      return state;
  }
}

interface GroupContextValue {
  groups: Group[];
  setG: (group: Group[]) => void;
  addG: (group: Group) => void;
  updateG: (group: Group) => void;
  deleteG: (groupId: string) => void;
}

const GroupContext = createContext<GroupContextValue | undefined>(undefined);

interface Props {
  readonly children: React.ReactNode;
}

export default function GroupProvider({ children }: Props) {
  const [groups, dispatch] = useReducer(groupReducer, []);

  function setG(group: Group[]) {
    dispatch({ type: typeCtx.GET_ALL, payload: group });
  }

  function addG(group: Group) {
    dispatch({ type: typeCtx.ADD, payload: group });
  }

  function updateG(group: Group) {
    dispatch({ type: typeCtx.UPDATE, payload: group });
  }

  function deleteG(groupId: string) {
    dispatch({ type: typeCtx.DELETE, payload: groupId });
  }

  const groupValue = useMemo(
    () => ({
      groups,
      setG,
      addG,
      updateG,
      deleteG,
    }),
    [groups]
  );

  return (
    <GroupContext.Provider value={groupValue}>{children}</GroupContext.Provider>
  );
}

export function useGroupContext() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroupContext must be used within a ContextProvider");
  }
  return context;
}

