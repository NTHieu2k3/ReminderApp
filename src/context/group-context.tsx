import { Group } from "models/Group";
import { createContext, useContext, useMemo, useReducer } from "react";

type Action =
  | { type: "GET_ALL"; payload: Group[] }
  | { type: "ADD"; payload: Group }
  | { type: "UPDATE"; payload: Group }
  | { type: "DELETE"; payload: string };

function groupReducer(state: Group[], action: Action): Group[] {
  switch (action.type) {
    case "GET_ALL":
      return action.payload;
    case "ADD":
      return [...state, action.payload];
    case "UPDATE":
      return state.map((group) =>
        group.groupId === action.payload.groupId ? action.payload : group
      );
    case "DELETE":
      return state.filter((group) => group.groupId !== action.payload);
    default:
      return state;
  }
}

interface GroupContextValue {
  groups: Group[];
  getAllG: (group: Group[]) => void;
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

  function getAllG(group: Group[]) {
    dispatch({ type: "GET_ALL", payload: group });
  }

  function addG(group: Group) {
    dispatch({ type: "ADD", payload: group });
  }

  function updateG(group: Group) {
    dispatch({ type: "UPDATE", payload: group });
  }

  function deleteG(groupId: string) {
    dispatch({ type: "DELETE", payload: groupId });
  }

  const groupValue = useMemo(
    () => ({
      groups,
      getAllG,
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

