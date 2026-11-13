import { useState } from "react";
import type { ReactNode } from "react";
import { PropertyContext } from "./PropertyContext";
import type { ListingDefaultType } from "../../types/propertyTypes";

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<ListingDefaultType[]>([]);

  return (
    <PropertyContext.Provider value={{ properties, setProperties }}>
      {children}
    </PropertyContext.Provider>
  );
}
