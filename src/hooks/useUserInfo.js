import useSWR from "swr";
import handleFetch from "utils/CustomFetch";
import { useRouter } from "next/router";
import { useState } from "react";

export default function useUserInfo(userId, options) {
  const [hasStartFetching, setHasStartFetching] = useState(false);
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const router = useRouter();
  const { data, error, mutate } = useSWR(
    userId ? [`/api/user`, userId] : null,
    async (url) => {
      setHasStartFetching(true);
      const userData = await handleFetch(url, {
        user_id: userId,
      });
      return userData;
    },
    {
      onSuccess: async (data, key, config) => {
        await onSuccessCallback?.(data, key, config);
      },
      onError: (err, key, config) => {
        if (err?.response?.status === 401) {
          router.push("/api/auth/login");
        }
        onErrorCallback?.(err, key, config);
      },
    }
  );

  return {
    userInfo: data?.user?.db ?? null,
    isLoading: !data && !error && hasStartFetching,
    error: error,
    mutate,
  };
}
