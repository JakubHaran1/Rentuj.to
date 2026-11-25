import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";
import Suggestions from "./Suggestions";
import useSuggestions from "../../hooks/useSuggestions";

type SuggestionFieldProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "onBlur"
> & {
  label: string;
  name: string;
  type: "city" | "street" | "";
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  inputRef: React.Ref<HTMLInputElement>;
  placeholder: string;
};

function SuggestionField({
  label,
  type,
  name,
  value,
  onChange,
  onBlur,
  error,
  inputRef,
  placeholder,
  ...rest
}: SuggestionFieldProps) {
  const {
    fieldRef,
    suggestions,
    error: suggestionsError,
    search,
    close,
  } = useSuggestions(type);

  return (
    <div {...rest} ref={fieldRef}>
      <Input
        label={label}
        name={name}
        value={value}
        ref={inputRef}
        onBlur={onBlur}
        error={error}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          search(e.target.value);
        }}
      />

      <ErrorMessage txt={suggestionsError} />

      {suggestions.length == 0 ? (
        ""
      ) : (
        <div className="absolute w-full z-20">
          <Suggestions
            suggestions={suggestions}
            onSuggestionClick={(suggestion) => {
              onChange(suggestion);
              close();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default SuggestionField;
