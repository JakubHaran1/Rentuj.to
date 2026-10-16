import axios from "axios";
import { useForm } from "react-hook-form";
import { AuthService } from "../../services/authService";
import Button from "../common/Button";
import type { LoginCredentialsType } from "../../types";
import { useUserContext } from "../context/UserContext";
import IconButton from "../common/IconButton";
import { useState } from "react";
import Input from "../common/Input";

type SignInFormProps = {
  isOpen: boolean;
  onToggle: () => void;
  onSuccess: () => void;
  listingLoginPrompt: boolean;
};

function SignInForm({
  isOpen,
  onToggle,
  onSuccess,
  listingLoginPrompt,
}: SignInFormProps) {
  const { setUser } = useUserContext();
  const [formState, setFormState] = useState(true);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentialsType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginCredentialsType) => {
    try {
      const response = await AuthService.login(values);
      setUser(response.user);
      onSuccess();
    } catch (error: unknown) {
      setError("root.server", {
        type: "server",
        message: axios.isAxiosError<{ detail?: string }>(error)
          ? (error.response?.data?.detail ?? "Unable to sign in.")
          : "An unexpected error occurred.",
      });
    }
  };
  return (
    <details className="account-menu relative" open={isOpen}>
      <summary
        className="inline-flex cursor-pointer list-none items-center justify-center rounded-lg border border-[#2f80ed] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#2f80ed] transition-colors hover:bg-[#2f80ed] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f80ed] dark:hover:bg-[#2f80ed] dark:hover:text-white"
        onClick={(event) => {
          event.preventDefault();
          onToggle();
        }}
      >
        Sign in
      </summary>
      {formState ? (
        <form
          className="account-menu__panel absolute right-0 z-20 mt-2 w-[min(20rem,90vw)] rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <IconButton
            variant="close"
            className="text-right"
            onClick={(event) => {
              event.preventDefault();
              onToggle();
            }}
          />
          {errors.root?.server && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {errors.root.server.message}
            </p>
          )}

          <h2 className="text-lg font-semibold text-[#16324f] dark:text-white">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
            Sign in to manage your rentals.
          </p>
          {listingLoginPrompt && (
            <p className="mt-3 text-sm font-medium text-[#16324f] dark:text-slate-200">
              To add a listing, you need to be logged in.
            </p>
          )}
          <Input
            autoComplete="email"
            error={errors.email?.message}
            label="Email"
            placeholder="you@example.com"
            type="email"
            {...register("email", {
              required: "Email is required to login",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address.",
              },
            })}
          />
          <Input
            autoComplete="current-password"
            error={errors.password?.message}
            label="Password"
            aria-invalid={Boolean(errors.password)}
            placeholder="Create a password"
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          <Button
            className="mt-5 w-full py-3"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          <p
            className=" text-[#16324f] dark:text-slate-200 mt-2 text-center text-sm cursor-pointer"
            onClick={() => setFormState((e) => !e)}
          >
            Password remaining
          </p>
        </form>
      ) : (
        <form
          className="account-menu__panel absolute right-0 z-20 mt-2 w-[min(20rem,90vw)] rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <IconButton
            variant="close"
            className="text-right"
            onClick={(event) => {
              event.preventDefault();
              onToggle();
            }}
          />
          {errors.root?.server && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {errors.root.server.message}
            </p>
          )}

          <h2 className="text-lg font-semibold text-[#16324f] dark:text-white">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
            Sign in to manage your rentals.
          </p>
          {listingLoginPrompt && (
            <p className="mt-3 text-sm font-medium text-[#16324f] dark:text-slate-200">
              To add a listing, you need to be logged in.
            </p>
          )}

          <p
            className=" text-[#16324f] dark:text-slate-200 mt-2 text-center text-sm cursor-pointer"
            onClick={() => setFormState((e) => !e)}
          >
            Back to log in
          </p>
        </form>
      )}
    </details>
  );
}

export default SignInForm;
