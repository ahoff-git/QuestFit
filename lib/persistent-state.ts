import { useEffect, useRef, useState } from 'react';

type Serializer<T> = {
  parse: (value: string) => T;
  stringify: (value: T) => string;
};

const buildSerializer = <T>(): Serializer<T> => ({
  parse: (value: string) => JSON.parse(value) as T,
  stringify: (value: T) => JSON.stringify(value)
});

const isBrowser = () => typeof window !== 'undefined';

export const usePersistentState = <T>(
  storageKey: string,
  initialValue: T,
  serializer?: Serializer<T>
) => {
  const isHydrated = useRef(false);
  const serializerRef = useRef(serializer ?? buildSerializer<T>());
  const activeSerializer = serializerRef.current;
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      return;
    }

    try {
      const parsed = activeSerializer.parse(stored);
      setValue(parsed);
    } catch (error) {
      console.warn(`Failed to parse stored value for ${storageKey}`, error);
    }
  }, [activeSerializer, storageKey]);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    if (!isHydrated.current) {
      isHydrated.current = true;
      return;
    }

    try {
      window.localStorage.setItem(storageKey, activeSerializer.stringify(value));
    } catch (error) {
      console.warn(`Failed to persist value for ${storageKey}`, error);
    }
  }, [activeSerializer, storageKey, value]);

  return [value, setValue] as const;
};
