import { useEffect, useState } from "react";

const COURSE_TABLE_LOCAL_STORAGE_KEY = "NTU_CourseNeo_Course_Table_Key";

export interface NeoLocalStorageType {
  courseTableKey: string | null;
}

export default function useNeoLocalStorage() {
  const [neoLocalStorage, setNeoLocalStorage] =
    useState<NeoLocalStorageType | null>(null);
  useEffect(() => {
    // load from local storage when client side hydrated
    const courseTableKey = localStorage?.getItem(
      COURSE_TABLE_LOCAL_STORAGE_KEY
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
