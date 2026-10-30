import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { PropertyDetailType } from "../../types";

export type PropertyContextType = {
  properties: PropertyDetailType[];
  setProperties: Dispatch<SetStateAction<PropertyDetailType[]>>;
};

export const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined,
);

export function usePropertyContext() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
