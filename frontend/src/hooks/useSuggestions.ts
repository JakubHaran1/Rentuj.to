import { useCallback, useEffect, useRef, useState } from "react";
import { GeoService } from "../services/geoService";
import type { GeoApiResponseType } from "../types/propertyTypes";
import { handleDrfGetError } from "../services/helpers";

type SuggestionType = "city" | "street" | "";

export function formatSuggestions(data: GeoApiResponseType[], type: SuggestionType): string[] {
  const results = data.map(({ properties: { city, street } }) => {
    if (type === "city") return city?.trim() ?? "";
    if (type === "street") return street?.trim() ?? "";
    return [street?.trim(), city?.trim()].filter(Boolean).join(", ");
  });

  return [...new Set(results.filter(Boolean))];
}

function useSuggestions(type: SuggestionType) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [location, setlocation] = useState<string>("");

  const [error, setError] = useState("");

  const close = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);

    setSuggestions([]);
    setError("");
  }, []);

  const search = (value: string) => {
    if (timer.current !== null) clearTimeout(timer.current);

    setSuggestions([]);
    setError("");

    if (value.trim().length < 3) return;

    timer.current = setTimeout(async () => {
      try {
        const data = await GeoService.addressAutocomplete(
          value,
          type || undefined,
        );

        setSuggestions(formatSuggestions(data, type));
      } catch (error: unknown) {
        handleDrfGetError(error, setError);
      }
    }, 500);
  };

  const handleSetLocation = (suggestion: string) => {
    setlocation(suggestion);
    close();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        fieldRef.current &&
        !fieldRef.current.contains(event.target)
      ) {
        close();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, [close, type]);
  return {
    fieldRef,
    suggestions,
    error,
    search,
    location,
    handleSetLocation,
    close,
  };
}

export default useSuggestions;
