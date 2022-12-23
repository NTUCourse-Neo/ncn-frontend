import { useEffect, useState } from "react";
import { LATEST_NEWS_LASTCHECK_TS } from "@/constant";

export interface NeoLocalStorageType {
  latestNewsLastCheckTs: number | null;
}

export default function useNeoLocalStorage() {
  const [neoLocalStorage, setNeoLocalStorage] =
    useState<NeoLocalStorageType | null>(null);
  useEffect(() => {
    // load from local storage when client side hydrated
    const latestNewsLastCheckTs = localStorage.getItem(
      LATEST_NEWS_LASTCHECK_TS
    );

    setNeoLocalStorage({
      latestNewsLastCheckTs:
        latestNewsLastCheckTs === null
          ? null
          : parseInt(latestNewsLastCheckTs, 10),
    });
  }, []);

  return {
    neoLocalStorage: neoLocalStorage ?? null,
    setNeoLocalStorage,
  };
}
