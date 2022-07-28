import useSWR from "swr";
import handleFetch from "utils/CustomFetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { getCourseSyllabusData } from "queries/course";
import { hash_to_color_hex_with_hue } from "utils/colorAgent";
import { useUser } from "@auth0/nextjs-auth0";

export function useCourseEnrollData(courseSerial, options) {
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { data, error, mutate } = useSWR(
    user && courseSerial ? [`/api/course/enrollInfo`, courseSerial] : null,
    async (url) => {
      const courseEnrollData = await handleFetch(url, {
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
    refetch: () => {
      mutate();
    },
  };
}

export function useNTURatingData(courseId, options) {
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const { data, error, mutate } = useSWR(
    user && courseId ? [`/api/course/ntuRating`, courseId] : null,
    async (url) => {
      const ntuRatingData = await handleFetch(url, {
        courseId: courseId,
      });
      console.log(ntuRatingData);
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
    refetch: () => {
      mutate();
    },
  };
}

export function usePTTReviewData(courseId, options) {
  const { user } = useUser();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const {
    data: pttReviewData,
    error,
    mutate,
  } = useSWR(
    user && courseId ? `/api/course/ptt/review/${courseId}` : null,
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
      mutate();
    },
  };
}

export function usePTTExamData(courseId, options) {
  const { user } = useUser();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const {
    data: pttExamData,
    error,
    mutate,
  } = useSWR(
    user && courseId ? `/api/course/ptt/exam/${courseId}` : null,
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
      mutate();
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
  const {
    data: syllabusData,
    error,
    mutate,
  } = useSWR(
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
      mutate();
    },
  };
}

export function useSignUpPostData(courseId, options) {
  const { user } = useUser();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const {
    data: signUpPostData,
    error,
    mutate,
  } = useSWR(
    user && courseId ? `/api/social/getByCourseId/${courseId}` : null,
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
      mutate();
    },
  };
}
