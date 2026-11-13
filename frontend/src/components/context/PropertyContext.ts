import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { PropertyListingType } from "../../types/propertyTypes";

export type PropertyContextType = {
  properties: PropertyListingType[];
  setProperties: Dispatch<SetStateAction<PropertyListingType[]>>;
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
