import { useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import { AuthService } from "../../services/authService";
import { useState } from "react";

function ThanksPage() {
  const [detail, setDetail] = useState("");
  const [activationError, setActivationError] = useState<null | string>(null);
  const { uidb64, token } = useParams();

  const onActivationClick = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!uidb64 || !token)
        throw new Error("The email address could not be verified.");
      const data = await AuthService.activeAccount(uidb64, token);
      setDetail(data.detail);
      setActivationError(null);
    } catch {
      setActivationError(
        "The email address could not be verified. The link may be invalid or expired.",
      );
      setDetail("");
    }
  };
  return (
    <section className="mx-auto mt-20 max-w-xl rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <h1 className="text-2xl font-semibold text-[#16324f] dark:text-white">
        Verify your email address
      </h1>
      {activationError ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {activationError}
        </p>
      ) : detail ? (
        <p
          className="mt-4 leading-7 text-[#6b7280] dark:text-slate-300"
          role="status"
        >
          Your email address has been verified.
        </p>
      ) : (
        <p className="mt-4 leading-7 text-[#6b7280] dark:text-slate-300">
          Select the button below to verify this email address.
        </p>
      )}
      {!detail && !activationError && (
        <form
          onSubmit={onActivationClick}
        >
          <Button className="mt-5">Verify email address</Button>
        </form>
      )}
    </section>
  );
}

export default ThanksPage;
