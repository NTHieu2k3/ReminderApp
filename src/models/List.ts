import { IoniconsName } from "type/ionicons.type";

export interface List {
  listId: string;
  name: string;
  icon: IoniconsName;
  color: string;
  smartList?: boolean;
  groupId?: string | null;
}
