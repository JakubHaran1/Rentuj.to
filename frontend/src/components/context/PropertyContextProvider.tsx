import { useState } from "react";
import type { ReactNode } from "react";
import { PropertyContext } from "./PropertyContext";
import type { PropertyListingType } from "../../types/propertyTypes";

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<PropertyListingType[]>([]);

  return (
    <PropertyContext.Provider value={{ properties, setProperties }}>
      {children}
    </PropertyContext.Provider>
  );
}
