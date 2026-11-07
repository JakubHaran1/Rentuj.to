import type { ReactNode } from "react";

type SuggestionsProps<T> = {
  suggestions: T[];
  getKey: (suggestion: T) => string | number;
  renderSuggestion: (suggestion: T) => ReactNode;
  onSuggestionClick: (suggestion: T) => void;
};
function Suggestions<T>({
  suggestions,
  getKey,
  onSuggestionClick,
  renderSuggestion,
}: SuggestionsProps<T>) {
  return (
    <ul className="mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[#c2c9d2] bg-white py-1 text-sm text-[#1f2937] shadow-xl ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10">
      {suggestions.map((suggestion) => (
        <li
          key={getKey(suggestion)}
          className="border-b border-slate-100 last:border-b-0 dark:border-slate-800"
        >
          <button
            type="button"
            className="block w-full px-4 py-3 text-left transition-colors hover:bg-slate-100 focus:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2f80ed] dark:hover:bg-slate-800 dark:focus:bg-slate-800"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {renderSuggestion(suggestion)}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Suggestions;
