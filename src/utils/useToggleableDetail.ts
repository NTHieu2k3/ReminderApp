import { useState } from "react";

interface ToggleableDetail<T> {
  enabled: boolean;
  value: T;
  toggle: () => void;
  set: (val: T) => void;
  reset: () => void;
}

export default function useToggleableDetail<T>(
  initialValue: T,
  defaultEnabled = false
): ToggleableDetail<T> {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [value, setValue] = useState<T>(initialValue);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (!next) {
      setValue(initialValue);
    }
  };

  const reset = () => {
    setEnabled(false);
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
