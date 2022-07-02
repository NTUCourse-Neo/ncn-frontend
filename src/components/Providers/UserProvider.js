import React, { createContext, useContext, useState, useEffect } from "react";
import instance from "queries/axiosInstance";
import handleAPIError from "utils/handleAPIError";

const UserDataContext = createContext({
  user: null,
  setUser: () => {},
  linkCoursetableToUser: async () => {},
  addFavoriteCourse: async () => {},
  patchUserInfo: async () => {},
  deleteUserAccount: async () => {},
  fetchUserById: async () => {},
  registerNewUser: async () => {},
});

function UserDataProvider(props) {
  const [user, setUser] = useState(null);

  const linkCoursetableToUser = async (token, course_table_id, user_id) => {
    try {
      const {
        data: { user },
      } = await instance.post(
        `/users/${user_id}/course_table`,
        { course_table_id: course_table_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(user);
    } catch (error) {
      throw handleAPIError(error);
    }
  };
  const addFavoriteCourse = async (token, new_favorite_list) => {
    try {
      const {
        data: { user },
      } = await instance.patch(
        `/users/`,
        { user: { favorites: new_favorite_list } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(user);
    } catch (error) {
      throw handleAPIError(error);
    }
  };
  const patchUserInfo = async (token, updateObject) => {
    try {
      const {
        data: { user },
      } = await instance.patch(
        `/users/`,
        { user: updateObject },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(user);
    } catch (error) {
      throw handleAPIError(error);
    }
  };
  const deleteUserAccount = async (token) => {
    try {
      await instance.delete(`/users/account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(null);
    } catch (error) {
      throw handleAPIError(error);
    }
  };
  const fetchUserById = async (token, user_id) => {
    try {
      const {
        data: { user },
      } = await instance.get(`/users/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // user contains user in db & auth0, either null (not found) or an object.
      return user;
    } catch (error) {
      throw handleAPIError(error);
    }
  };
  const registerNewUser = async (token, email) => {
    try {
      const {
        data: { user },
      } = await instance.post(
        `/users/`,
        { user: { email: email } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // either null (not found) or an object.
      return user;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  useEffect(() => {
    console.log("user: ", user);
  }, [user]);

  return (
    <UserDataContext.Provider
      value={{
        user,
        setUser,
        linkCoursetableToUser,
        addFavoriteCourse,
        patchUserInfo,
        deleteUserAccount,
        fetchUserById,
        registerNewUser,
      }}
      {...props}
    />
  );
}

const useUserData = () => {
  return useContext(UserDataContext);
};

export { UserDataProvider, useUserData };
