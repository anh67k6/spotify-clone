import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
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
  const [cookie, setCookie] = useCookies(["token"]);

  useEffect(() => {
    setUser(cookie.user);
  }, [cookie]);
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
