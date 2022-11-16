import useSWR from "swr";
import handleFetch from "utils/CustomFetch";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { getCourseSyllabusData } from "queries/course";
import { hash_to_color_hex_with_hue } from "utils/colorAgent";
import { useUser } from "@auth0/nextjs-auth0";
import type {
  CourseEnrollStatus,
  CourseRatingData,
  PTTData,
  SignUpPost,
} from "@/types/course";

interface Options {
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

export function useCourseEnrollData(
  courseSerial: string | null,
  options?: Options
) {
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { data, error, mutate } = useSWR(
    user && courseSerial ? [`/api/course/enrollInfo`, courseSerial] : null,
    async (url) => {
      const courseEnrollData = await handleFetch<{
        course_id: string;
        course_status: CourseEnrollStatus | null;
        update_ts: string;
        message: string;
      }>(url, {
        courseId: courseSerial,
      });
      return courseEnrollData;
    },
    {
      onSuccess: async (data, key, config) => {
        await onSuccessCallback?.(data, key, config);
      },
      onError: (err, key, config) => {
        if (err?.response?.status === 401) {
          router.push("/api/auth/login");
        }
        toast({
          title: "錯誤",
          description: "無法取得課程即時資訊",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        onErrorCallback?.(err, key, config);
      },
    }
  );

  return {
    data: data?.course_status ?? null,
    isLoading: !data && !error,
    error: error,
    mutate,
  };
}

export function useSyllabusData(courseId: string, options?: Options) {
  const toast = useToast();
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { data, error, mutate } = useSWR(
    courseId ? `/courses/${courseId}/syllabus` : null,
    async (url) => {
      const data = await getCourseSyllabusData(courseId);
      if (data?.course_syllabus?.grade) {
        data.course_syllabus.grade.forEach((grade) => {
          grade.color = hash_to_color_hex_with_hue(grade.title, {
            min: 180,
            max: 200,
          });
        });
      }
      return data;
    },
    {
      onSuccess: async (data, key, config) => {
        await onSuccessCallback?.(data, key, config);
      },
      onError: (err, key, config) => {
        if (err?.response?.status === 401) {
          router.push("/api/auth/login");
        }
        toast({
          title: "無法取得課程大綱資訊",
          description: "請洽台大課程網",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        onErrorCallback?.(err, key, config);
      },
    }
  );

  return {
    data: data?.course_syllabus ?? null,
    isLoading: !data && !error,
    error: error,
    mutate,
  };
}
