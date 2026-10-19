import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { AuthService } from "../../services/authService";

import { useState } from "react";
import axios from "axios";
type ChangeType = {
  password: string;
  confirm: string;
};
type ChangeResponse = {
  detail: string;
};
function PasswordChangePage() {
  const { uidb64, token } = useParams();
  const [changeStatus, setChangeStatus] = useState<{ detail: string }>({
    detail: "",
  });

  const changePasswordForm = useForm<{ password: string; confirm: string }>({
    defaultValues: { password: "", confirm: "" },
  });

  const onChangePasswordSubmit = async (data: ChangeType) => {
    try {
      if (!uidb64 || !token) throw new Error("Something goes wrong");
      const changeData = { uidb64: uidb64, token: token, ...data };
      const resp = await AuthService.changePassword(changeData);
      setChangeStatus(resp);
    } catch (error: unknown) {
      if (axios.isAxiosError<ChangeType>(error)) {
        const data = error.response?.data;
        if (data) {
          Object.entries(data).forEach(([key, value]) => {
            changePasswordForm.setError(key as keyof ChangeType, {
              message: value,
            });
          });
          return;
        }
      } else if (axios.isAxiosError<ChangeResponse>(error)) {
        const detail = error.response?.data.detail;
        if (detail) {
          changePasswordForm.setError("root.server", {
            message: detail,
          });
          return;
        }
        changePasswordForm.setError("root.server", {
          message: "Activation link wasn't correct",
        });
      }
    }
  };
  return (
    <section className="rounded-xl  border border-[#c2c9d2] bg-[#e9edf2] mt-20 mx-auto p-4 py-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="md:w-3/4 mx-auto">
        <h3 className="max-w-2xl text-3xl font-semibold tracking-tight text-[#16324f] sm:text-2xl dark:text-white">
          Change your password
        </h3>
        {changeStatus.detail && (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">
            {changeStatus.detail}
          </p>
        )}
        <p className="mb-3 text-sm text-blue-800 dark:text-slate-300">
          Choose a strong, unique password to help protect your account. For
          better security, make sure your password:
        </p>

        <ul className="space-y-2 text-sm text-blue-800 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-600 dark:text-blue-400">✓</span>
            <span>Is at least 12 characters long.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-600 dark:text-blue-400">✓</span>
            <span>
              Uses a mix of letters, numbers, and symbols when possible.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-600 dark:text-blue-400">✓</span>
            <span>
              Does not contain easily guessed information, such as your name or
              birthday.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-600 dark:text-blue-400">✓</span>
            <span>Is unique and not reused on other websites or services.</span>
          </li>
        </ul>
        <form
          className="w-3/4"
          onSubmit={changePasswordForm.handleSubmit(onChangePasswordSubmit)}
        >
          <Input
            autoComplete="new-password"
            error={changePasswordForm.formState.errors.password?.message}
            label="Password"
            placeholder="Create a password"
            type="password"
            {...changePasswordForm.register("password", {
              required: "Password is required",
            })}
          />
          <Input
            autoComplete="new-password"
            error={changePasswordForm.formState.errors.confirm?.message}
            label="Password"
            placeholder="Confirm your new password"
            type="password"
            {...changePasswordForm.register("confirm", {
              required: "Confirm password is required",
            })}
          />
          <Button className="mt-5 py-3">Change password</Button>
        </form>
      </div>
    </section>
  );
}

export default PasswordChangePage;
