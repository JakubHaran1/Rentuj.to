import { useEffect, useMemo, useState } from "react";
import { UserContext } from "./UserContext";
import type { ReactNode } from "react";
import type { UserResponseType } from "../../types";

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponseType["user"] | undefined>(
    undefined,
  );
  const contextValue = useMemo(() => ({ user, setUser }), [user]);

  useEffect(() => {
    const clearUser = () => setUser(undefined);
    window.addEventListener("auth:logout", clearUser);

    return () => window.removeEventListener("auth:logout", clearUser);
  }, []);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
