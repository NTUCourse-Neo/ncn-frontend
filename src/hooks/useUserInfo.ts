import useSWR from "swr";
import handleFetch from "utils/CustomFetch";
import { useRouter } from "next/router";
import useNeoToast from "@/hooks/useNeoToast";
import type { User } from "types/user";
import type { Course } from "types/course";
import { AxiosError } from "axios";

export default function useUserInfo(
  userId: string | null,
  options?: {
    readonly onSuccessCallback?: (
      data: {
        user: User | null;
        message: string;
      },
      key: string,
      config: unknown
    ) => void;
    readonly onErrorCallback?: (
      data: unknown,
      key: string,
      config: unknown
    ) => void;
  }
) {
  const toast = useNeoToast();
  const onSuccessCallback = options?.onSuccessCallback;
  const onErrorCallback = options?.onErrorCallback;
  const router = useRouter();
  const { data, error, mutate } = useSWR(
    userId ? [`/api/user`, userId] : null,
    async (url) => {
      const userData = await handleFetch<{
        user: User | null;
        message: string;
      }>(url, {
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

  const addOrRemoveFavorite = async (courseId: string, courseName: string) => {
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
            const data = await handleFetch<{
              favorites: Course[];
              message: string;
            }>(`/api/user/removeFavoriteCourse`, {
              course_id: courseId,
            });
            toast("remove_favorite", `${courseName}`, {}, async () => {
              // Undo remove favorite
              await mutate(
                async (prev) => {
                  if (!prev?.user?.db?.favorites) {
                    return prev;
                  }
                  const data = await handleFetch<{
                    favorites: Course[];
                    message: string;
                  }>(`/api/user/addFavoriteCourse`, {
                    course_id: courseId,
                  });
                  return {
                    ...prev,
                    user: {
                      ...prev.user,
                      db: {
                        ...prev.user.db,
                        favorites: data.favorites,
                      },
                    },
                  };
                },
                {
                  revalidate: false,
                  populateCache: true,
                }
              );
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
            const data = await handleFetch<{
              favorites: Course[];
              message: string;
            }>(`/api/user/addFavoriteCourse`, {
              course_id: courseId,
            });
            toast("add_favorite", `${courseName}`);
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
    } catch (error) {
      toast("operation_failed", `${courseName}`);
      if ((error as AxiosError)?.response?.status === 401) {
        router.push("/api/auth/login");
      }
    }
  };

  return {
    userInfo: data?.user?.db ?? null,
    isLoading: !data && !error && !(userId === null || userId === undefined),
    error: error,
    mutate,
    addOrRemoveFavorite,
  };
}
