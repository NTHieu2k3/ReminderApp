import { useState } from "react";

// Kiểu boolean số học: 0 (false), 1 (true)
export type BooleanNumber = 0 | 1;

interface ToggleNumberSwitch {
  enabled: BooleanNumber;
  setEnabled: React.Dispatch<React.SetStateAction<BooleanNumber>>;
  toggle: () => void;
  reset: () => void;
}

export default function useToggleNumberSwitch(
  initialEnable: BooleanNumber = 0
): ToggleNumberSwitch {
  const [enabled, setEnabled] = useState<BooleanNumber>(initialEnable);

  const toggle = () => setEnabled((prev) => (prev === 1 ? 0 : 1));
  const reset = () => setEnabled(0);

  return { enabled, toggle, setEnabled, reset };
}
