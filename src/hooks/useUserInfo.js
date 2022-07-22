import useSWR, { useSWRConfig } from "swr";
import handleFetch from "utils/CustomFetch";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function useUserInfo(userId, options) {
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data: user, error } = useSWR(
    userId ? `/api/user` : null,
    async (url) => {
      const userData = await handleFetch(url, {
        user_id: userId,
      });
      return userData;
    },
    {
      onSuccess: async (data, key, config) => {
        await onSuccessCallback?.(data, key, config);
        mutate("/api/user");
      },
      onError: (err, key, config) => {
        if (err?.response?.status === 401) {
          router.push("/api/auth/login");
        }
        onErrorCallback?.(err, key, config);
      },
    }
  );

  useEffect(() => {
    console.log("SWR USER: ", user);
    console.log("SWR loading: ", !error && !user);
    console.log("SWR error: ", error);
  }, [user, error]);

  return {
    userInfo: user?.db ?? null,
    isLoading: !error && !user,
    error: error,
    refetch: () => {
      mutate(`/api/user`);
    },
  };
}
