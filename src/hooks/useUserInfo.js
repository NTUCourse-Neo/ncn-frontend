import useSWR, { useSWRConfig } from "swr";
import handleFetch from "utils/CustomFetch";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function useUserInfo(
  userId,
  onErrorCallback = (err, key, config) => {}
) {
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
      onError: (err, key, config) => {
        if (err?.response?.status === 401) {
          router.push("/api/auth/login");
        }
        onErrorCallback(err, key, config);
      },
    }
  );

  useEffect(() => {
    console.log("SWR USER: ", user);
    console.log("SWR loading: ", !error && !user);
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
