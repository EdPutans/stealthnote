import { useCallback, useState } from "react";

export type ArgumentTypes<F extends (...args: any) => void> = F extends (...args: infer A) => any ? A : never;

/**
 * Somewhat hackier but from personal experience,
 * more reliable debounce implementation than the ones in useHooks
 */
export const useDebounce = <F extends (...args: any) => void>(func: F, debounceTime: number) => {
  const [, setLastTimerId] = useState<NodeJS.Timer | 0>(0);

  const debouncedFunc = useCallback(
    (...args: ArgumentTypes<F>) => {
      const timerId = setTimeout(() => {
        // legacy TS complaining in some cases
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        func(...args);
        setLastTimerId(0);
      }, debounceTime);

      setLastTimerId((prev) => {
        // an antipattern, but the only way to clear the timer
        // without adding it as a dep
        if (prev) clearTimeout(prev);

        return timerId;
      });
    },
    // adding timer ID as a dep will break this. Please watch out
    [debounceTime, func],
  );

  return debouncedFunc;
};
