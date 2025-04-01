import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      return () => clearTimeout(handler);
    }, delay);
  }, [delay, value]);

  return debouncedValue;
};

export default useDebounce;
