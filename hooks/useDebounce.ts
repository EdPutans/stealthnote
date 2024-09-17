import { useCallback, useState } from "react";

export type ArgumentTypes<F extends (...args: any) => void> = F extends (...args: infer A) => any ? A : never;

/**
 * Somewhat hackier but from personal experience,
 * more reliable debounce implementation than the ones in useHooks
 */
const useDebounce = <F extends (...args: any) => void>(func: F, debounceTime: number) => {
  const [, setLastTimerId] = useState<NodeJS.Timer | 0>(0);

  const debouncedFunc = useCallback(
    (...args: ArgumentTypes<F>) => {
      const timerId = setTimeout(() => {
        // legacy TS complaining occasionally
        // @ts-ignore
        func(...args);
        setLastTimerId(0);
      }, debounceTime);

      setLastTimerId((prev) => {
        // an antipattern, but the only way to clear the timer
        // without adding it as a dep, which turns it into a render loop
        if (prev) clearTimeout(prev);

        return timerId;
      });
    },
    // adding timer ID as a dep will break this. Don't.
    [debounceTime, func],
  );

  return debouncedFunc;
};
export default useDebounce;