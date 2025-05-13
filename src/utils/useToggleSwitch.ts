import { useState } from "react";

interface ToggleSwitch {
  enabled: boolean;
  toggle: () => void;
  resert: () => void;
}

export default function useToggleSwitch(initialEnabled = false): ToggleSwitch {
  const [enabled, setEnabled] = useState(initialEnabled);

  const toggle = () => setEnabled((prev: any) => !prev);

  const resert = () => setEnabled(false);

  return { enabled, toggle, resert };
}
