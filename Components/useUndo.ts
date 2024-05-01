import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const useUndo = (localStorageKey: string, state: string) => {
  const [past, setPast] = useState<string[]>([]);
  const [present, setPresent] = useState<string>(state);
  const [future, setFuture] = useState<string[]>([]);

  const effect = async() => {
    const storedState = await AsyncStorage.getItem(localStorageKey);
    if (storedState !== present) {
      setPast([...past, present]);
      setPresent(state);
      setFuture([]);
      localStorage.setItem(localStorageKey, state);
    }
  };

  useEffect(effect, []);

  const undo = () => {
    if (past.length !== 0) {
      setFuture([present, ...future]);
      setPresent(past[past.length - 1]);
      setPast(past.slice(0, past.length - 1));
    }
  };

  const redo = () => {
    if (future.length !== 0) {
      setPast([...past, present]);
      setPresent(future[0]);
      setFuture(future.slice(1));
    }
  };

  return { undo, redo };
};

export default useUndo;