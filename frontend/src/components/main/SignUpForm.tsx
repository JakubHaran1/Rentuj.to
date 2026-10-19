import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

import Button from "../common/Button";
import Input from "../common/Input";
import IconButton from "../common/IconButton";

import type { RegisterUserType } from "../../types";
import { AuthService } from "../../services/authService";

type SignUpFormProps = {
  isOpen: boolean;
  onToggle: () => void;
};
const fields = [
  "name",
  "second_name",
  "email",
  "password",
  "confirm_password",
  "avatar",
  "birth_date",
  "user_type",
];

function SignUpForm({ isOpen, onToggle }: SignUpFormProps) {
  const [registerStatus, setRegisterStatus] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserType>({
    defaultValues: {
      name: "",
      second_name: "",
      email: "",
      password: "",
      avatar: "",
      confirm_password: "",
      birth_date: "",
      user_type: "RENTER",
    },
  });

  const onSubmit = async (userData: RegisterUserType) => {
    try {
      await AuthService.register(userData);
      setRegisterStatus(true);
      reset();
    } catch (error: unknown) {
      if (axios.isAxiosError<RegisterUserType>(error)) {
        const data = error.response?.data;
        if (data != undefined)
          Object.entries(data).forEach(([key, val]) => {
            if (fields.includes(key))
              if (typeof val === "string")
                setError(key as keyof RegisterUserType, {
                  type: "server",
                  message: val,
                });
              else if (Array.isArray(val)) {
                setError(key as keyof RegisterUserType, {
                  type: "server",
                  message: val.join(",\n"),
                });
              }
          });
        else {
          setError("root.server", {
            type: "server",
            message: "Unable to sign up.\n An unexpected error occurred.",
          });
        }
      }
    }
  };
  return (
    <details className="account-menu relative" open={isOpen}>
      <summary
        className="inline-flex cursor-pointer list-none items-center justify-center rounded-lg border border-[#2f80ed] bg-[#2f80ed] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-transparent hover:text-[#2f80ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f80ed] dark:border-[#2f80ed] dark:bg-[#2f80ed] dark:text-white dark:hover:bg-transparent dark:hover:text-[#60a5fa]"
        onClick={(event) => {
          event.preventDefault();
          onToggle();
        }}
      >
        Sign up
      </summary>

      <form
        className="account-menu__panel absolute right-0 z-20 mt-2 w-[min(20rem,90vw)] rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        onSubmit={handleSubmit(onSubmit)}
      >
        <IconButton
          variant="close"
          className="text-right"
          onClick={(event) => {
            event.preventDefault();
            onToggle();
            setRegisterStatus(false);
          }}
        />
        {!registerStatus ? (
          <>
            {errors.root?.server && (
              <p className="mt-4 text-sm text-red-600" role="alert">
                {errors.root.server.message}
              </p>
            )}

            <h2 className="text-lg font-semibold text-[#16324f] dark:text-white">
              Create an account
            </h2>
            <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
              Join Rentuj.to to find your next home.
            </p>

            <Input
              autoComplete="name"
              error={errors.name?.message}
              label="Name"
              placeholder="Your name"
              type="text"
              labelClassName="mt-5"
              {...register("name", { required: "Name is required" })}
            />

            <Input
              autoComplete="secondname"
              error={errors.second_name?.message}
              label="Middle name"
              placeholder="Your Middle name"
              type="text"
              labelClassName="mt-5"
              {...register("second_name", {
                required: "Middle name is required",
              })}
            />
            <Input
              autoComplete="email"
              error={errors.email?.message}
              label="Email"
              placeholder="you@example.com"
              type="email"
              {...register("email", {
                required: "Email name is required",
              })}
            />

            <label className="mt-4 block text-sm font-medium text-[#1f2937] dark:text-slate-200">
              Account type
              <select
                className="mt-1.5 w-full rounded-lg border border-[#c2c9d2] bg-white px-3  py-2.5 text-sm outline-none focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                defaultValue="RENTER"
                {...register("user_type", {
                  required: "User Type is required",
                })}
              >
                <option value="RENTER">Renter</option>
                <option value="OWNER">Owner</option>
              </select>
            </label>

            <Input
              accept="image/*"
              error={errors.avatar?.message}
              label="Profile image (optional)"
              type="file"
              labelClassName="mt-5"
              {...register("avatar", {
                required: "Avatar is required",
              })}
            />
            <Input
              autoComplete="new-password"
              error={errors.password?.message}
              label="Password"
              placeholder="Create a password"
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <Input
              autoComplete="new-password"
              error={errors.confirm_password?.message}
              label="Confirm Password"
              placeholder="Confirm a password"
              type="password"
              {...register("confirm_password", {
                required: "Confirm password is required",
              })}
            />
            <Input
              autoComplete="birth"
              error={errors.birth_date?.message}
              label="Birth date"
              type="date"
              {...register("birth_date", {
                required: "Birth date is required",
              })}
            />
            <Button className="mt-5 w-full py-3" type="submit">
              {!isSubmitting ? "Create account" : "Signing up..."}
            </Button>
          </>
        ) : (
          <>
            <h3 className="font-semibold text-[#16324f] dark:text-white">
              Thank you for setting up an account in our platform.
            </h3>
            <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
              Please, Check you email to finish the registration process
            </p>
          </>
        )}
      </form>
    </details>
  );
}

export default SignUpForm;
