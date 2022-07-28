import useSWR, { useSWRConfig } from "swr";
import { useState } from "react";
import { fetchCourseTable } from "queries/courseTable";

export default function useCourseTable(courseTableId, options) {
  const [isExpired, setIsExpired] = useState(false);
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { mutate } = useSWRConfig();
  const { data, error } = useSWR(
    courseTableId ? `/v2/course_tables/${courseTableId}` : null,
    async () => {
      const courseTableData = await fetchCourseTable(courseTableId);
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

  return {
    courseTable: data?.course_table ?? null,
    isLoading: !data && !error,
    error,
    isExpired,
    refetch: () => {
      mutate(`/v2/course_tables/${courseTableId}`);
    },
  };
}
