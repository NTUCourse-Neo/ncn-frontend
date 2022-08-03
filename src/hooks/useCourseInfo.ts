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

export function useCourseEnrollData(courseSerial: string, options: Options) {
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

export function useNTURatingData(courseId: string, options: Options) {
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { data, error, mutate } = useSWR(
    user && courseId ? [`/api/course/ntuRating`, courseId] : null,
    async (url) => {
      const ntuRatingData = await handleFetch<{
        course_id: string;
        course_rating: CourseRatingData | null;
        update_ts: string;
        message: string;
      }>(url, {
        courseId: courseId,
      });
      return ntuRatingData;
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
          title: "無法取得 NTURating 評價資訊",
          description: "請洽 rating.myntu.me",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        onErrorCallback?.(err, key, config);
      },
    }
  );

  return {
    data: data?.course_rating ?? null,
    isLoading: !data && !error,
    error: error,
    mutate,
  };
}

export function usePTTReviewData(courseId: string, options: Options) {
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { data, error, mutate } = useSWR(
    user && courseId ? `/api/course/ptt/review/${courseId}` : null,
    async (url) => {
      const data = await handleFetch<{
        course_id: string;
        course_rating: PTTData | null;
        update_ts: string;
        message: string;
      }>("/api/course/ptt", {
        courseId: courseId,
        type: "review",
      });
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
          title: "無法取得 PTT 貼文資訊",
          description: "請洽 ptt.cc",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        onErrorCallback?.(err, key, config);
      },
    }
  );

  return {
    data: data?.course_rating ?? null,
    isLoading: !data && !error,
    error: error,
    mutate,
  };
}

export function usePTTExamData(courseId: string, options: Options) {
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { data, error, mutate } = useSWR(
    user && courseId ? `/api/course/ptt/exam/${courseId}` : null,
    async (url) => {
      const data = await handleFetch<{
        course_id: string;
        course_rating: PTTData | null;
        update_ts: string;
        message: string;
      }>("/api/course/ptt", {
        courseId: courseId,
        type: "exam",
      });
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
          title: "無法取得 PTT 貼文資訊",
          description: "請洽 ptt.cc",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        onErrorCallback?.(err, key, config);
      },
    }
  );

  return {
    data: data?.course_rating ?? null,
    isLoading: !data && !error,
    error: error,
    mutate,
  };
}

export function useSyllabusData(courseId: string, options: Options) {
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

export function useSignUpPostData(courseId: string, options: Options) {
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { data, error, mutate } = useSWR(
    user && courseId ? `/api/social/getByCourseId/${courseId}` : null,
    async (url) => {
      const data = await handleFetch<{
        posts: SignUpPost[];
      }>("/api/social/getByCourseId", {
        course_id: courseId,
      });
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
          title: "無法取得加簽資訊",
          description: "請稍後再試一次",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        onErrorCallback?.(err, key, config);
      },
    }
  );

  return {
    data: data?.posts ?? null,
    isLoading: !data && !error,
    error: error,
    mutate,
  };
}
