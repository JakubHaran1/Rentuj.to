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
        throw new Error("Your account acctivation has been failed");
      const data = await AuthService.activeAccount(uidb64, token);
      setDetail(data.detail);
      setActivationError(null);
    } catch {
      setActivationError("Your account acctivation has been failed");
      setDetail("");
    }
  };
  return (
    <section className="rounded-xl border border-[#c2c9d2] bg-[#e9edf2] mt-20 mx-auto p-4  shadow-sm dark:border-slate-800 dark:bg-slate-900 md:w-sm lg:w-xl  ">
      {activationError ?? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {activationError}
        </p>
      )}
      <div>
        <p className="text-md font-semibold text-[#2e8b57]">
          Your accont has been successfully created
        </p>
        <p className="mt-4 max-w-xl leading-7 text-[#6b7280] dark:text-slate-300">
          Now you can login to your account.
        </p>
      </div>
      {!detail ? (
        <form
          onSubmit={(e: React.SubmitEvent<HTMLFormElement>) =>
            onActivationClick(e)
          }
        >
          <Button className="mt-5 py-3">Active your account</Button>
        </form>
      ) : (
        <Button to="/" className="mt-5 py-3">
          Go to Homepage
        </Button>
      )}
    </section>
  );
}

export default ThanksPage;
