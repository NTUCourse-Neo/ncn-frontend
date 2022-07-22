import useSWR, { useSWRConfig } from "swr";
import { useState } from "react";
import { fetchCourseTable } from "queries/courseTable";

export default function useCourseTable(courseTableId, options) {
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { mutate } = useSWRConfig();
  const { data: courseTable, error } = useSWR(
    courseTableId ? `/v2/course_tables/${courseTableId}` : null,
    async () => {
      setIsLoading(true);
      const courseTableData = await fetchCourseTable(courseTableId);
      setIsLoading(false);
      return courseTableData;
    },
    {
      onSuccess: async (data, key, config) => {
        setIsLoading(false);
        await onSuccessCallback?.(data, key, config);
        setIsExpired(false);
      },
      onError: async (err, key, config) => {
        setIsLoading(false);
        if (err?.response?.status === 403 || err?.response?.status === 404) {
          setIsExpired(true);
        }
        await onErrorCallback?.(err, key, config);
      },
    }
  );

  return {
    courseTable,
    isLoading,
    error,
    isExpired,
    refetch: () => {
      mutate(`/v2/course_tables/${courseTableId}`);
    },
  };
}
