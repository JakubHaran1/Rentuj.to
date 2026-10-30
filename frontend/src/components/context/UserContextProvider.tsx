import { useEffect, useMemo, useState } from "react";
import { UserContext } from "./UserContext";
import type { ReactNode } from "react";
import type { AuthStatus, UserType } from "../../types";
import { AuthService } from "../../services/authService";

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      authStatus,
    }),
    [user, authStatus],
  );
  useEffect(() => {
    async function checkCurrentUser() {
      try {
        const response = await AuthService.login();
        setUser(response.user);
        setAuthStatus("authenticated");
      } catch {
        setUser(undefined);
        setAuthStatus("unauthenticated");
      }
    }

    checkCurrentUser();
  }, []);
  useEffect(() => {
    const clearUser = () => setUser(undefined);
    window.addEventListener("auth:logout", clearUser);

    return () => window.removeEventListener("auth:logout", clearUser);
  }, []);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
