import { Ionicons } from "@expo/vector-icons";
import React from "react";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export interface List {
  listId: string;
  name: string;
  icon: IoniconsName;
  color: string;
  amount: number;
  smartList?: boolean;
  groupId?: string;
}
