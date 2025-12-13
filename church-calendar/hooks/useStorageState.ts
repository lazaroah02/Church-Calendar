import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

/**
 * Hook para manejar estado persistente en storage, con valor por defecto opcional
 */
export function useStorageState(
  key: string,
  defaultValue: string | null = null
): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>([true, defaultValue]);

  // Obtener valor guardado
  useEffect(() => {
    let isMounted = true;

    const loadValue = async () => {
      try {
        let storedValue: string | null = null;

        if (Platform.OS === 'web') {
          storedValue = localStorage.getItem(key);
        } else {
          storedValue = await SecureStore.getItemAsync(key);
        }

        if (isMounted) {
          setState(storedValue ?? defaultValue); // usar default si no hay valor guardado
        }
      } catch (e) {
        console.error('Error reading storage:', e);
        if (isMounted) setState(defaultValue);
      }
    };

    loadValue();

    return () => {
      isMounted = false;
    };
  }, [key, defaultValue]);

  // Guardar valor
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
