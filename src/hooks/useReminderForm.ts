import { List } from "models/List";
import { useState } from "react";
import useToggleableDetailNumber from "./useToggleableDetail";
import useToggleNumberSwitch from "./useToggleSwitch";

export default function useReminderForm() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isDetail, setIsDetail] = useState(false);

  const date = useToggleableDetailNumber<string>("", 0);
  const time = useToggleableDetailNumber<string>("", 0);
  const location = useToggleNumberSwitch(0);
  const priority = useToggleableDetailNumber<string>("", 0);
  const tag = useToggleableDetailNumber<string>("", 0);
  const flag = useToggleNumberSwitch(0);
  const messaging = useToggleNumberSwitch(0);

  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  return {
    title,
    setTitle,
    notes,
    setNotes,
    selectedList,
    setSelectedList,
    expanded,
    setExpanded,
    isDetail,
    setIsDetail,
    date,
    time,
    location,
    priority,
    tag,
    flag,
    messaging,
    image,
    setImage,
    url,
    setUrl,
  };
}
