import { useEffect, useState } from "react";
import { NCN_COURSE_TABLE_LOCAL_STORAGE_KEY } from "constant";
import { decipherId } from "utils/cipher";

export interface NeoLocalStorageType {
  courseTableKey: string | null;
}

export default function useNeoLocalStorage() {
  const [neoLocalStorage, setNeoLocalStorage] =
    useState<NeoLocalStorageType | null>(null);
  useEffect(() => {
    // load from local storage when client side hydrated
    const courseTableKey = decipherId(
      localStorage?.getItem(NCN_COURSE_TABLE_LOCAL_STORAGE_KEY)
    );
    setNeoLocalStorage({
      courseTableKey,
    });
  }, []);

  return {
    neoLocalCourseTableKey: neoLocalStorage?.courseTableKey ?? null,
    setNeoLocalStorage,
  };
}
