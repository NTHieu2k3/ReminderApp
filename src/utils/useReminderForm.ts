import { List } from "models/List";
import { useState } from "react";
import useToggleableDetail from "./useToggleableDetail";
import useToggleSwitch from "./useToggleSwitch";

export default function useReminderForm() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const date = useToggleableDetail<string>("", false);
  const time = useToggleableDetail<string>("", false);
  const location = useToggleSwitch(false);
  const priority = useToggleableDetail<string>("", false);
  const tag = useToggleableDetail<string>("", false);
  const flag = useToggleSwitch(false);
  const messaging = useToggleSwitch(false);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  return {
    title, setTitle,
    notes, setNotes,
    selectedList, setSelectedList,
    expanded, setExpanded,
    isDetail, setIsDetail,
    date, time, location, priority, tag, flag, messaging,
    image, setImage,
    url, setUrl,
  };
}