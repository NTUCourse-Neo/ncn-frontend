import React, { createContext, useContext, useState, useEffect } from "react";

const UserDataContext = createContext({
  user: null,
  setUser: () => {},
});

function UserDataProvider(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("user: ", user);
  }, [user]);

  return (
    <UserDataContext.Provider
      value={{
        user,
        setUser,
      }}
      {...props}
    />
  );
}

const useUserData = () => {
  return useContext(UserDataContext);
};

export { UserDataProvider, useUserData };
