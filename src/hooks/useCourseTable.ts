import useSWR from "swr";
import { useState } from "react";
import { fetchCourseTable } from "queries/courseTable";
import { useToast } from "@chakra-ui/react";
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
  const toast = useToast();
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
        const operation_str =
          (newCourseTableData?.course_table?.courses?.length ?? 0) >
          originalCourseTableLength
            ? "加入"
            : "移除";
        toast({
          title: `已${operation_str} ${course.name}`,
          description: `課表: ${courseTable.name}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (e) {
        toast({
          title: `新增 ${course.name} 失敗`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: `新增 ${course.name} 失敗`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
