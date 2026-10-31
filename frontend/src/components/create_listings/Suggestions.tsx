import type { Path, UseFormReturn } from "react-hook-form";
import type { CreateFormStateType } from "../../types";
import type { Dispatch, SetStateAction } from "react";

type SuggestionsProps = {
  fieldName: Path<CreateFormStateType>;
  fieldSuggestions: string[];
  form: UseFormReturn<CreateFormStateType>;
  clean_list: Dispatch<SetStateAction<string>>;
};
function Suggestions({
  fieldName,
  fieldSuggestions,
  form,
  clean_list,
}: SuggestionsProps) {
  return (
    <ul className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[#c2c9d2] bg-white py-1 text-sm text-[#1f2937] shadow-xl ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10">
      {fieldSuggestions.map((suggestion) => (
        <li
          key={suggestion}
          className="border-b border-slate-100 last:border-b-0 dark:border-slate-800"
        >
          <button
            type="button"
            className="block w-full px-4 py-3 text-left transition-colors hover:bg-slate-100 focus:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2f80ed] dark:hover:bg-slate-800 dark:focus:bg-slate-800"
            onClick={() => {
              form.setValue(fieldName, suggestion, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clean_list("");
            }}
          >
            {suggestion}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Suggestions;
