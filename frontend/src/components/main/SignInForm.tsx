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

type RemindPasswordType = {
  email: string;
};

function SignInForm({
  isOpen,
  onToggle,
  onSuccess,
  listingLoginPrompt,
}: SignInFormProps) {
  const { setUser } = useUserContext();
  const [formType, setFormType] = useState(true);
  const [remindState, setRemindState] = useState<string>("");

  const loginForm = useForm<LoginCredentialsType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const remindForm = useForm<RemindPasswordType>({
    defaultValues: {
      email: "",
    },
  });
  const onSubmitLogin = async (values: LoginCredentialsType) => {
    try {
      const response = await AuthService.login(values);
      setUser(response.user);
      onSuccess();
      loginForm.reset();
    } catch (error: unknown) {
      loginForm.setError("root.server", {
        type: "server",
        message: axios.isAxiosError<{ detail?: string }>(error)
          ? (error.response?.data?.detail ?? "Unable to sign in.")
          : "An unexpected error occurred.",
      });
    }
  };

  const onSubmitRemind = async (value: RemindPasswordType) => {
    try {
      const resp = await AuthService.remindPassword(value.email);
      setRemindState(resp.detail);
      remindForm.reset();
    } catch {
      remindForm.setError("root.server", {
        type: "server",
        message: "Unable to send an activation message.",
      });
    }
  };

  const onResetRemind = () => {
    remindForm.reset();
    setFormType(true);
    setRemindState("");
  };
  return (
    <details className="account-menu relative" open={isOpen}>
      <summary
        className="inline-flex cursor-pointer list-none items-center justify-center rounded-lg border border-[#2f80ed] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#2f80ed] transition-colors hover:bg-[#2f80ed] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f80ed] dark:hover:bg-[#2f80ed] dark:hover:text-white"
        onClick={(event) => {
          event.preventDefault();
          onToggle();
          onResetRemind();
        }}
      >
        Sign in
      </summary>
      {formType ? (
        <form
          className="account-menu__panel absolute right-0 z-20 mt-2 w-[min(20rem,90vw)] rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          noValidate
          onSubmit={loginForm.handleSubmit(onSubmitLogin)}
        >
          <IconButton
            variant="close"
            className="text-right"
            onClick={(event) => {
              event.preventDefault();
              onToggle();
            }}
          />
          {loginForm.formState.errors.root?.server && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {loginForm.formState.errors.root.server.message}
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
            error={loginForm.formState.errors.email?.message}
            label="Email"
            placeholder="you@example.com"
            type="email"
            {...loginForm.register("email", {
              required: "Email is required to login",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address.",
              },
            })}
          />
          <Input
            autoComplete="current-password"
            error={loginForm.formState.errors.password?.message}
            label="Password"
            aria-invalid={Boolean(loginForm.formState.errors.password)}
            placeholder="Create a password"
            type="password"
            {...loginForm.register("password", {
              required: "Password is required",
            })}
          />
          <Button
            className="mt-5 w-full py-3"
            disabled={loginForm.formState.isSubmitting}
            type="submit"
          >
            {loginForm.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          <p
            className=" text-[#16324f] dark:text-slate-200 mt-4 text-center text-sm cursor-pointer"
            onClick={() => setFormType(false)}
          >
            Password recovery
          </p>
        </form>
      ) : (
        <form
          className="account-menu__panel absolute right-0 z-20 mt-2 w-[min(20rem,90vw)] rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          noValidate
          onSubmit={remindForm.handleSubmit(onSubmitRemind)}
        >
          <IconButton
            variant="close"
            className="text-right"
            onClick={(event) => {
              event.preventDefault();
              onToggle();
              onResetRemind();
            }}
          />
          {remindForm.formState.errors.root?.server && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {remindForm.formState.errors.root.server.message}
            </p>
          )}

          <h2 className="text-lg font-semibold text-[#16324f] dark:text-white">
            Welcome back
          </h2>

          {remindState ? (
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
              {remindState}
            </p>
          ) : (
            <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
              If you forget the password, you can easly remind it:
            </p>
          )}
          {remindForm.formState.errors.root?.server && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {remindForm.formState.errors.root.server.message}
            </p>
          )}
          <Input
            autoComplete="email"
            error={remindForm.formState.errors.email?.message}
            label="Email"
            placeholder="you@example.com"
            type="email"
            {...remindForm.register("email", {
              required: "Email is required to remind a password",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address.",
              },
            })}
          />
          <Button
            className="mt-5 w-full py-3"
            disabled={remindForm.formState.isSubmitting}
            type="submit"
          >
            {remindForm.formState.isSubmitting
              ? "Sending"
              : "Send  a reminder message"}
          </Button>
          <p
            className=" text-[#16324f] dark:text-slate-200 mt-4 text-center text-sm cursor-pointer"
            onClick={() => {
              setFormType(true);
              onResetRemind();
            }}
          >
            Back to log in
          </p>
        </form>
      )}
    </details>
  );
}

export default SignInForm;
