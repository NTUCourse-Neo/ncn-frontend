import { useEffect, useState } from "react";

export interface NeoLocalStorageType {
  latestNewsLastCheckTs?: number | null;
}

export default function useNeoLocalStorage() {
  const [neoLocalStorage, setNeoLocalStorage] =
    useState<NeoLocalStorageType | null>(null);
  useEffect(() => {
    // load from local storage when client side hydrated
    setNeoLocalStorage({});
  }, []);

  return {
    neoLocalStorage: neoLocalStorage ?? null,
    setNeoLocalStorage,
  };
}
