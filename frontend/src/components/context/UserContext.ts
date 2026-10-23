import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { UserResponseType } from "../../types";

export type UserContextType = {
  user: UserResponseType["user"] | undefined;
  setUser: Dispatch<SetStateAction<UserResponseType["user"] | undefined>>;
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
