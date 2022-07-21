import useSWR, { useSWRConfig } from "swr";
import handleFetch from "utils/CustomFetch";
import { useEffect } from "react";

export function useUserInfo(userId, onError = () => {}) {
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
      onError: onError,
    }
  );

  useEffect(() => {
    console.log("SWR USER: ", user);
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
