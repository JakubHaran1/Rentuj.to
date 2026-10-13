import { useState } from "react";
import { UserContext } from "./UserContext";
import type { ReactNode } from "react";
import type { User } from "../../types";

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
