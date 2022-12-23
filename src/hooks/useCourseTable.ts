import useSWR from "swr";
import { useState } from "react";
import { fetchCourseTable } from "queries/courseTable";
import useNeoToast from "@/hooks/useNeoToast";
import { patchCourseTable } from "queries/courseTable";
import type { Course } from "types/course";

export default function useCourseTable(
  courseTableId: string | null,
  options?: {
    readonly onSuccessCallback?: (
      data: unknown,
      key: string,
      config: unknown
    ) => void;
    readonly onErrorCallback?: (
      data: unknown,
      key: string,
      config: unknown
    ) => void;
  }
) {
  const toast = useNeoToast();
  const [isExpired, setIsExpired] = useState(false);
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { data, error, mutate } = useSWR(
    courseTableId ? `/v2/course_tables/${courseTableId}` : null,
    async () => {
      const courseTableData = await fetchCourseTable(courseTableId as string);
      return courseTableData;
    },
    {
      onSuccess: async (data, key, config) => {
        await onSuccessCallback?.(data, key, config);
        setIsExpired(false);
      },
      onError: async (err, key, config) => {
        if (err?.response?.status === 403 || err?.response?.status === 404) {
          setIsExpired(true);
        }
        await onErrorCallback?.(err, key, config);
      },
    }
  );

  const addOrRemoveCourse = async (course: Course) => {
    const courseTable = data?.course_table;
    if (courseTable && courseTableId) {
      try {
        const originalCourseTableLength = courseTable?.courses?.length ?? 0;
        const newCourseTableData = await mutate(
          async (prev) => {
            if (courseTable.courses.map((c) => c.id).includes(course.id)) {
              const data = await patchCourseTable(
                courseTableId,
                courseTable.name,
                courseTable.user_id,
                courseTable.courses
                  .map((c) => c.id)
                  .filter((id) => id !== course.id)
              );
              return data ?? prev;
            } else {
              const data = await patchCourseTable(
                courseTableId,
                courseTable.name,
                courseTable.user_id,
                [...courseTable.courses.map((c) => c.id), course.id]
              );
              return data ?? prev;
            }
          },
          {
            revalidate: false,
            populateCache: true,
          }
        );
        if (
          (newCourseTableData?.course_table?.courses?.length ?? 0) >
          originalCourseTableLength
        ) {
          toast("add_course", course.name);
        } else {
          toast("remove_course", course.name, {}, async () => {
            await mutate(
              async (prev) => {
                const data = await patchCourseTable(
                  courseTableId,
                  courseTable.name,
                  courseTable.user_id,
                  [...courseTable.courses.map((c) => c.id)]
                );
                return data ?? prev;
              },
              { revalidate: false, populateCache: true }
            );
          });
        }
      } catch (e) {
        toast("operation_failed", `新增${course.name}失敗`);
      }
    } else {
      toast("operation_failed", `新增${course.name}失敗`);
    }
  };

  return {
    courseTable: data?.course_table ?? null,
    isLoading:
      !data &&
      !error &&
      !(courseTableId === null || courseTableId === undefined),
    error,
    isExpired,
    mutate,
    addOrRemoveCourse,
  };
}
