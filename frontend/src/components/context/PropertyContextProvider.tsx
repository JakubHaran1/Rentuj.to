import { useState } from "react";
import type { ReactNode } from "react";
import { PropertyContext } from "./PropertyContext";
import type { PropertyDetailType } from "../../types";

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<PropertyDetailType[]>([]);

  return (
    <PropertyContext.Provider value={{ properties, setProperties }}>
      {children}
    </PropertyContext.Provider>
  );
}
