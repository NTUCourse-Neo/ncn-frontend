import useSWR from "swr";
import handleFetch from "utils/CustomFetch";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

export default function useUserInfo(userId, options) {
  const toast = useToast();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const router = useRouter();
  const { data, error, mutate } = useSWR(
    userId ? [`/api/user`, userId] : null,
    async (url) => {
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

  const addOrRemoveFavorite = async (courseId) => {
    try {
      await mutate(
        async (prevUser) => {
          if (
            !prevUser?.user?.db?.favorites ||
            !Array.isArray(prevUser?.user?.db?.favorites)
          ) {
            return prevUser;
          }
          const favorite_list = prevUser.user.db.favorites.map((c) => c.id);
          if (favorite_list.includes(courseId)) {
            const data = await handleFetch(`/api/user/removeFavoriteCourse`, {
              course_id: courseId,
            });
            return {
              ...prevUser,
              user: {
                ...prevUser.user,
                db: {
                  ...prevUser.user.db,
                  favorites: data.favorites,
                },
              },
            };
          } else {
            const data = await handleFetch(`/api/user/addFavoriteCourse`, {
              course_id: courseId,
            });
            return {
              ...prevUser,
              user: {
                ...prevUser.user,
                db: {
                  ...prevUser.user.db,
                  favorites: data.favorites,
                },
              },
            };
          }
        },
        {
          revalidate: false,
          populateCache: true,
        }
      );
      toast({
        title: `????????????????????????`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `????????????????????????`,
        description: `???????????????`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      if (error?.response?.status === 401) {
        router.push("/api/auth/login");
      }
    }
  };

  return {
    userInfo: data?.user?.db ?? null,
    isLoading: !data && !error && userId,
    error: error,
    mutate,
    addOrRemoveFavorite,
  };
}
