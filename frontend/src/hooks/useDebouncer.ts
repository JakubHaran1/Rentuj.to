import { useEffect, useState } from "react";

function useDebouncer<T>(val: T, delay: number): T {
  const [debouncedVal, setDebouncedVal] = useState(val);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedVal(val), delay);
    return () => clearTimeout(timer);
  });
  return debouncedVal;
}

export default useDebouncer;
