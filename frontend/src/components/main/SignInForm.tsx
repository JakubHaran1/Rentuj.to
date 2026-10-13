import axios from "axios";
import { useForm } from "react-hook-form";
import { AuthService } from "../../services/authService";
import Button from "../common/Button";
import type { LoginCredentialsType } from "../../types";
import { useUserContext } from "../context/UserContext";

type SignInFormProps = {
  isOpen: boolean;
  onToggle: () => void;
  onSuccess: () => void;
};

function SignInForm({ isOpen, onToggle, onSuccess }: SignInFormProps) {
  const { setUser } = useUserContext();

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
      <form
        className="account-menu__panel absolute right-0 z-20 mt-2 w-[min(20rem,90vw)] rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-lg font-semibold text-[#16324f] dark:text-white">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
          Sign in to manage your rentals.
        </p>

        <label className="mt-5 block text-sm font-medium text-[#1f2937] dark:text-slate-200">
          Email
          <input
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "signin-email-error" : undefined}
            className="mt-1.5 w-full rounded-lg border border-[#c2c9d2] bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-[#9ca3af] focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
        </label>
        {errors.email && (
          <p
            id="signin-email-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}

        <label className="mt-4 block text-sm font-medium text-[#1f2937] dark:text-slate-200">
          Password
          <input
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "signin-password-error" : undefined
            }
            className="mt-1.5 w-full rounded-lg border border-[#c2c9d2] bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-[#9ca3af] focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            placeholder="Enter your password"
            type="password"
            {...register("password", {
              required: "Password is required to login",
            })}
          />
        </label>
        {errors.password && (
          <p
            id="signin-password-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.password.message}
          </p>
        )}

        {errors.root?.server && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {errors.root.server.message}
          </p>
        )}

        <Button
          className="mt-5 w-full py-3"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </details>
  );
}

export default SignInForm;
