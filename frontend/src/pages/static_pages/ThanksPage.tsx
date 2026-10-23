import { useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import { AuthService } from "../../services/authService";
import { useState } from "react";

function ThanksPage() {
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");

  const { uidb64, token } = useParams();

  const onActivationClick = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!uidb64 || !token)
        throw new Error("The email address could not be verified.");
      const data = await AuthService.activeAccount(uidb64, token);
      setDetail(data.detail);
      setError("");
    } catch {
      setDetail("");
      setError(
        "The email address could not be verified. The link may be invalid or expired.",
      );
    }
  };

  const onResendClick = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      if (!uidb64) {
        setDetail("");
        setError(
          "The email address could not be verified. The link may be invalid or expired.",
        );
        return;
      }
      await AuthService.resendActivationLink(uidb64);
      setDetail("A verification link has been sent to you.");
      setError("");
    } catch {
      setDetail("");
      setError(
        "The email address could not be verified. The link may be invalid or expired.",
      );
    }
  };

  return (
    <section className="mx-auto mt-20 max-w-xl rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <h1 className="text-2xl font-semibold text-[#16324f] dark:text-white">
        Verify your email address
      </h1>
      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : detail ? (
        <p
          className="mt-4 leading-7 text-[#6b7280] dark:text-slate-300"
          role="status"
        >
          {detail}
        </p>
      ) : (
        <p className="mt-4 leading-7 text-[#6b7280] dark:text-slate-300">
          Select the button below to verify this email address.
        </p>
      )}
      {error ? (
        <form onSubmit={onResendClick}>
          <Button className="mt-5">Resend the verification link</Button>
        </form>
      ) : !detail ? (
        <form onSubmit={onActivationClick}>
          <Button className="mt-5">Verify email address</Button>
        </form>
      ) : null}
    </section>
  );
}

export default ThanksPage;
