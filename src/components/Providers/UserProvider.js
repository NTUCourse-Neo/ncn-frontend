import React, { createContext, useContext, useState } from "react";

const UserDataContext = createContext({
  user: null,
  setUser: () => {},
});

function UserDataProvider(props) {
  const [user, setUser] = useState(null);

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
