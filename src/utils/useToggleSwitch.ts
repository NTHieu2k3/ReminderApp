import { useState } from "react";

interface ToggleSwitch {
  enabled: boolean;
  toggle: () => void;
  resert: () => void;
}

export default function useToggleSwitch(initialEnable = false): ToggleSwitch {
  const [enabled, setEnabled] = useState(initialEnable);

  const toggle = () => setEnabled((prev: any) => !prev);

  const resert = () => setEnabled(false);

  return {enabled, toggle, resert}
}
