import { useState } from "react";

export type BooleanNumber = 0 | 1;

interface ToggleableDetailNumber<T> {
  enabled: BooleanNumber;
  value: T;
  toggle: () => void;
  set: (val: T) => void;
  reset: () => void;
}

export default function useToggleableDetailNumber<T>(
  initialValue: T,
  defaultEnabled: BooleanNumber = 0
): ToggleableDetailNumber<T> {
  const [enabled, setEnabled] = useState<BooleanNumber>(defaultEnabled);
  const [value, setValue] = useState<T>(initialValue);

  const toggle = () => {
    const next: BooleanNumber = enabled === 1 ? 0 : 1;
    setEnabled(next);
    if (next === 0) {
      setValue(initialValue);
    }
  };

  const reset = () => {
    setEnabled(0);
    setValue(initialValue);
  };

  return {
    enabled,
    value,
    toggle,
    set: setValue,
    reset,
  };
}
