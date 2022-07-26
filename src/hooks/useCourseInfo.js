import useSWR, { useSWRConfig } from "swr";
import handleFetch from "utils/CustomFetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { getCourseSyllabusData } from "queries/course";
import { hash_to_color_hex_with_hue } from "utils/colorAgent";

export function useCourseEnrollData(courseSerial, options) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { mutate } = useSWRConfig();
  const { data: courseEnroll, error } = useSWR(
    courseSerial ? `/api/course/enrollInfo` : null,
    async (url) => {
      setIsLoading(true);
      const courseEnrollData = await handleFetch(url, {
        courseId: courseSerial,
      });
      setIsLoading(false);
      return courseEnrollData;
    },
    {
      onSuccess: async (data, key, config) => {
        setIsLoading(false);
        await onSuccessCallback?.(data, key, config);
      },
      onError: (err, key, config) => {
        setIsLoading(false);
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
    data: courseEnroll ?? null,
    isLoading,
    error: error,
    refetch: () => {
      mutate(`/api/course/enrollInfo`);
    },
  };
}

export function useNTURatingData(courseId, options) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { mutate } = useSWRConfig();
  const { data: ntuRating, error } = useSWR(
    courseId ? `/api/course/ntuRating` : null,
    async (url) => {
      setIsLoading(true);
      const ntuRatingData = await handleFetch(url, {
        courseId: courseId,
      });
      setIsLoading(false);
      return ntuRatingData;
    },
    {
      onSuccess: async (data, key, config) => {
        setIsLoading(false);
        await onSuccessCallback?.(data, key, config);
      },
      onError: (err, key, config) => {
        setIsLoading(false);
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
    data: ntuRating ?? null,
    isLoading,
    error: error,
    refetch: () => {
      mutate(`/api/course/ntuRating`);
    },
  };
}

export function usePTTReviewData(courseId, options) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { mutate } = useSWRConfig();
  const { data: pttReviewData, error } = useSWR(
    courseId ? `/api/course/ptt/review/${courseId}` : null,
    async (url) => {
      setIsLoading(true);
      const data = await handleFetch("/api/course/ptt", {
        courseId: courseId,
        type: "review",
      });
      setIsLoading(false);
      return data;
    },
    {
      onSuccess: async (data, key, config) => {
        setIsLoading(false);
        await onSuccessCallback?.(data, key, config);
      },
      onError: (err, key, config) => {
        setIsLoading(false);
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
    data: pttReviewData ?? null,
    isLoading,
    error: error,
    refetch: () => {
      mutate(`/api/course/ptt/review/${courseId}`);
    },
  };
}

export function usePTTExamData(courseId, options) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { mutate } = useSWRConfig();
  const { data: pttExamData, error } = useSWR(
    courseId ? `/api/course/ptt/exam/${courseId}` : null,
    async (url) => {
      setIsLoading(true);
      const data = await handleFetch("/api/course/ptt", {
        courseId: courseId,
        type: "exam",
      });
      setIsLoading(false);
      return data;
    },
    {
      onSuccess: async (data, key, config) => {
        setIsLoading(false);
        await onSuccessCallback?.(data, key, config);
      },
      onError: (err, key, config) => {
        setIsLoading(false);
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
    data: pttExamData ?? null,
    isLoading,
    error: error,
    refetch: () => {
      mutate(`/api/course/ptt/exam/${courseId}`);
    },
  };
}

export function useSyllabusData(courseId, options) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { mutate } = useSWRConfig();
  const { data: syllabusData, error } = useSWR(
    courseId ? `/courses/${courseId}/syllabus` : null,
    async (url) => {
      setIsLoading(true);
      const data = await getCourseSyllabusData(courseId);
      setIsLoading(false);
      return data;
    },
    {
      onSuccess: async (data, key, config) => {
        setIsLoading(false);
        await onSuccessCallback?.(data, key, config);
      },
      onError: (err, key, config) => {
        setIsLoading(false);
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

  useEffect(() => {
    if (syllabusData && syllabusData.grade) {
      syllabusData.grade.forEach((grade) => {
        grade.color = hash_to_color_hex_with_hue(grade.title, {
          min: 180,
          max: 200,
        });
      });
    }
    setData(syllabusData);
  }, [syllabusData]);

  return {
    data: data ?? null,
    isLoading,
    error: error,
    refetch: () => {
      mutate(`/courses/${courseId}/syllabus`);
    },
  };
}

// not used
export function useSignUpPostData(courseId, options) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { mutate } = useSWRConfig();
  const { data: signUpPostData, error } = useSWR(
    courseId ? `/api/social/getByCourseId/${courseId}` : null,
    async (url) => {
      setIsLoading(true);
      const data = await handleFetch("/api/social/getByCourseId", {
        course_id: courseId,
      });
      setIsLoading(false);
      return data;
    },
    {
      onSuccess: async (data, key, config) => {
        setIsLoading(false);
        await onSuccessCallback?.(data, key, config);
      },
      onError: (err, key, config) => {
        setIsLoading(false);
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
    data: signUpPostData ?? null,
    isLoading,
    error: error,
    refetch: () => {
      mutate(`/api/social/getByCourseId/${courseId}`);
    },
  };
}
