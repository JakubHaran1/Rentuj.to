import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { UserType } from "../../types";

export type UserContextType = {
  user: UserType | undefined;
  setUser: Dispatch<SetStateAction<UserType | undefined>>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext can be used only inside UserProvider");
  }
  return context;
}
