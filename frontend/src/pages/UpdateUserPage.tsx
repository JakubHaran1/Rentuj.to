import { useForm } from "react-hook-form";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ErrorMessage from "../components/common/ErrorMessage";
import { useUserContext } from "../components/context/UserContext";
import type { EditUserType } from "../types/userTypes";
import { AuthService } from "../services/authService";
import { useEffect, useState } from "react";
import { handleDrfPostError } from "../services/helpers";

const editableFields = [
  "name",
  "second_name",
  "email",
  "avatar",
  "password",
  "confirm_password",
] as const;
type EditableField = (typeof editableFields)[number];

const comparableField = ["name", "second_name", "email"] as const;

type ComparableField = (typeof comparableField)[number];

function UpdateUserPage() {
  const [formState, setFormState] = useState<"email" | "" | "success">("");
  const { user } = useUserContext();
  const updateForm = useForm<EditUserType>({
    defaultValues: {
      name: user?.name ?? "",
      second_name: user?.second_name ?? "",
      email: user?.email ?? "",
      password: "",
      confirm_password: "",
    },
  });
  const { reset } = updateForm;

  // Reset form state
  useEffect(() => {
    if (!user) return;
    console.log(user.second_name);
    reset({
      name: user.name,
      second_name: user.second_name,
      email: user.email,
      password: "",
      confirm_password: "",
    });
  }, [user, reset]);

  const onSumbitEdit = async (editData: EditUserType) => {
    const userId = user?.pk;
    console.log(userId);
    console.log(user);

    if (!userId) {
      updateForm.setError("root.server", {
        type: "server",
        message: "No user",
      });
      return;
    }
    try {
      const { password, confirm_password, avatar, ...profileData } = editData;

      const dataToCompare: Partial<Pick<EditUserType, ComparableField>> = {};

      for (const field of comparableField) {
        const value = user[field];
        if (value !== profileData[field]) {
          dataToCompare[field] = profileData[field];
        }
      }

      const dataToSend =
        password || confirm_password
          ? { ...profileData, password, confirm_password }
          : { avatar, ...dataToCompare };
      console.log(avatar);
      if (avatar?.length == 0 && Object.values(dataToSend).length === 1) {
        updateForm.setError("root.server", {
          type: "server",
          message: "Your data are the same!",
        });
        setFormState("");
        return;
      }
      console.log(dataToSend);
      await AuthService.editUserData(dataToSend, userId);
      setFormState(editData.email !== user.email ? "email" : "success");
    } catch (error: unknown) {
      handleDrfPostError<EditUserType, EditableField>(
        error,
        updateForm,
        editableFields,
        "Unable to update your profile. Please check the entered data.",
      );
    }
  };
  return (
    <section className="mx-auto my-10 max-w-4xl rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-5 shadow-sm sm:my-14 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      <header className="border-b border-[#c2c9d2] pb-6 dark:border-slate-700">
        <p className="text-sm font-semibold text-[#2e8b57]">Your account</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f] sm:text-3xl dark:text-white">
          Edit profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280] dark:text-slate-300">
          Update your personal details and the information shown on your
          account.
        </p>
      </header>

      <form className="mt-6" onSubmit={updateForm.handleSubmit(onSumbitEdit)}>
        {updateForm.formState.errors.root?.server && (
          <ErrorMessage txt={updateForm.formState.errors.root.server.message} />
        )}
        {formState && (
          <p className="mb-4 text-sm text-green-700" role="status">
            {formState === "email"
              ? "A confirmation link was sent to your new email address. Your account email will change after confirmation."
              : "Profile updated successfully."}
          </p>
        )}
        <section
          aria-labelledby="profile-photo-heading"
          className="border-b border-[#c2c9d2] pb-6 dark:border-slate-700"
        >
          <h2
            className="text-lg font-semibold text-[#16324f] dark:text-white"
            id="profile-photo-heading"
          >
            Profile photo
          </h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              aria-label="Profile photo preview"
              className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[#d8dee7] text-2xl font-semibold text-[#16324f] dark:bg-slate-700 dark:text-white"
              role="img"
            >
              ?
            </div>
            <div className="w-full max-w-md">
              <Input
                accept="image/*"
                error={updateForm.formState.errors.avatar?.message}
                label="Choose a profile photo"
                type="file"
                {...updateForm.register("avatar")}
              />
              <p className="mt-2 text-xs text-[#6b7280] dark:text-slate-400">
                JPG, PNG or GIF.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="personal-details-heading" className="mt-6">
          <h2
            className="text-lg font-semibold text-[#16324f] dark:text-white"
            id="personal-details-heading"
          >
            Personal details
          </h2>
          <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
            <Input
              autoComplete="given-name"
              error={updateForm.formState.errors.name?.message}
              label="First name"
              placeholder="Your first name"
              {...updateForm.register("name")}
            />
            <Input
              autoComplete="family-name"
              error={updateForm.formState.errors.second_name?.message}
              label="Last name"
              placeholder="Your last name"
              {...updateForm.register("second_name")}
            />
            <Input
              autoComplete="email"
              error={updateForm.formState.errors.email?.message}
              label="Email address"
              placeholder="you@example.com"
              type="email"
              {...updateForm.register("email")}
            />
            <Input
              autoComplete="new-password"
              error={updateForm.formState.errors.password?.message}
              label="Password"
              type="password"
              {...updateForm.register("password")}
            />

            <Input
              autoComplete="new-password"
              error={updateForm.formState.errors.confirm_password?.message}
              label="Confirm Password"
              type="password"
              {...updateForm.register("confirm_password")}
            />
          </div>
        </section>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#c2c9d2] pt-6 sm:flex-row sm:justify-end dark:border-slate-700">
          <Button className="w-full sm:w-auto" to="/" variant="secondary">
            Cancel
          </Button>
          <Button className="w-full sm:w-auto" type="submit">
            Save changes
          </Button>
        </div>
      </form>
    </section>
  );
}

export default UpdateUserPage;
