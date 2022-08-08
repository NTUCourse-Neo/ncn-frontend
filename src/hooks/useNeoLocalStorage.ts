import { useEffect, useState } from "react";
import { NCN_COURSE_TABLE_LOCAL_STORAGE_KEY } from "constant";

export interface NeoLocalStorageType {
  courseTableKey: string | null;
}

export default function useNeoLocalStorage() {
  const [neoLocalStorage, setNeoLocalStorage] =
    useState<NeoLocalStorageType | null>(null);
  useEffect(() => {
    // load from local storage when client side hydrated
    const courseTableKey = localStorage?.getItem(
      NCN_COURSE_TABLE_LOCAL_STORAGE_KEY
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
