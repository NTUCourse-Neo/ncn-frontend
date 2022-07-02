import React, { createContext, useContext, useState, useEffect } from "react";
import instance from "queries/axiosInstance";

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
    return user;
  };

  const addFavoriteCourse = async (token, new_favorite_list) => {
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
    return user;
  };
  const patchUserInfo = async (token, updateObject) => {
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
    return user;
  };
  const deleteUserAccount = async (token) => {
    await instance.delete(`/users/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const fetchUserById = async (token, user_id) => {
    const {
      data: { user },
    } = await instance.get(`/users/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // user contains user in db & auth0, either null (not found) or an object.
    return user;
  };
  const registerNewUser = async (token, email) => {
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
