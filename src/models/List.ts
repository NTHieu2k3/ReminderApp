import { Ionicons } from "@expo/vector-icons";
import React from "react";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export interface List {
  listId: string;
  name: string;
  icon: IoniconsName;
  color: string;
  smartList?: boolean;
  groupId?: string;
}
