import useSWR, { useSWRConfig } from "swr";
import handleFetch from "utils/CustomFetch";
import { useState } from "react";
import { useRouter } from "next/router";

export default function useUserInfo(userId, options) {
  const [isLoading, setIsLoading] = useState(false);
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data: user, error } = useSWR(
    userId ? `/api/user` : null,
    async (url) => {
      setIsLoading(true);
      const userData = await handleFetch(url, {
        user_id: userId,
      });
      setIsLoading(false);
      return userData;
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
        onErrorCallback?.(err, key, config);
      },
    }
  );

  return {
    userInfo: user?.db ?? null,
    isLoading,
    error: error,
    refetch: () => {
      mutate(`/api/user`);
    },
  };
}
