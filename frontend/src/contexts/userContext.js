import { createContext } from "react";
import { useState } from "react";
export const userContext = createContext({
  user: null,
  setUser: (user) => {},
  token: null,
  setToken: (token) => {},
});

export default userContext;

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
