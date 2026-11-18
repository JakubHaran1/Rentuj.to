import axios from "axios";
import type { Dispatch, SetStateAction } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

const handleDrfPostError = <F extends FieldValues, K extends string>(
  error: unknown,
  externalForm: UseFormReturn<F>,
  fieldsKeys: readonly string[],
  errorMessage: string,
) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    // second check if error is an object, if not server would receives some response but some error occures

    if (data && typeof data === "object") {
      Object.entries(data).forEach(([key, value]) => {
        // check if key_name of error is in editable fields - if yes it is normal model drf error with field but when not, it would be error for whole form or general message
        if (fieldsKeys.includes(key as K)) {
          // if value is an array it means there are more errors with this field
          if (typeof value === "string") {
            externalForm.setError(key as Path<F>, {
              type: "server",
              message: value,
            });
          }

          if (Array.isArray(value)) {
            const error_arr: string[] = [];
            value.forEach((el) => error_arr.push(el));
            externalForm.setError(key as Path<F>, {
              type: "server",
              message: error_arr.join(",\n "),
            });
          }
        } else if (
          (key === "detail" || key === "non_field_errors") &&
          (typeof value === "string" || Array.isArray(value))
        ) {
          const error_arr = [];

          if (typeof value === "string") error_arr.push(value);
          if (Array.isArray(value)) error_arr.push(value);

          externalForm.setError("root.server", {
            type: "server",
            message: error_arr.join(",\n "),
          });
        }
      });
    } else {
      externalForm.setError("root.server", {
        type: "server",
        message: error.response
          ? errorMessage
          : "Unable to connect. Please try again.",
      });
    }
  } else {
    externalForm.setError("root.server", {
      type: "server",
      message: "An unexpected error occurred. Please try again.",
    });
  }
};

const handleDrfGetError = (
  error: unknown,
  setError: Dispatch<SetStateAction<string>>,
) => {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;

    if (!error.response) {
      setError("Unable to connect. Please try again.");
    } else if (
      data !== null &&
      typeof data === "object" &&
      "detail" in data &&
      typeof data.detail === "string"
    ) {
      setError(data.detail);
    } else {
      setError("An error occurred. Please try again.");
    }
  } else {
    setError("An unexpected error occurred. Please try again.");
  }
};

export { handleDrfPostError, handleDrfGetError };
