import type { Dispatch, SetStateAction } from "react";
import { useUserContext } from "../context/UserContext";

type AccountMenuProps = {
  openMenu: "signin" | "signup" | "account" | null;
  setOpenMenu: Dispatch<SetStateAction<"signin" | "signup" | "account" | null>>;
};

function AccountMenu({ openMenu, setOpenMenu }: AccountMenuProps) {
  const { user } = useUserContext();
  return (
    <details className="account-menu relative" open={openMenu === "account"}>
      <summary
        className="flex cursor-pointer list-none items-center gap-2 rounded-lg p-1.5 hover:bg-[#dfe3e9] dark:hover:bg-slate-800"
        onClick={(event) => {
          event.preventDefault();
          setOpenMenu((current) =>
            current === "account" ? null : "account",
          );
        }}
      >
        {user ? (
          <>
            <span className="flex size-9 items-center justify-center rounded-full bg-[#d8dee7] text-sm font-semibold text-[#16324f] dark:bg-slate-700 dark:text-white">
              JK
            </span>
            <span className="hidden max-w-28 text-left sm:block">
              <span className="block text-sm font-semibold text-[#1f2937] dark:text-white">
                {user.name}
              </span>
              <span className="block text-xs text-[#6b7280]">
                {user.user_type}
              </span>
            </span>
            <span aria-hidden="true" className="text-xs text-[#6b7280]">
              ▾
            </span>
          </>
        ) : null}
      </summary>

      <div className="account-menu__panel absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-2 rounded-lg bg-[#dfe4eb] p-3 dark:bg-slate-800">
          <p className="text-sm font-semibold text-[#16324f] dark:text-white">
            Your account
          </p>
          <p className="mt-1 text-xs leading-5 text-[#6b7280] dark:text-slate-300">
            Manage your rental, agreements and conversations in one place.
          </p>
        </div>
        <a className="account-menu__link" href="#account">
          My account
        </a>
        <a className="account-menu__link" href="#write-review">
          Write a review
        </a>
        <a className="account-menu__link" href="#report-dispute">
          Report a dispute
        </a>
        <a className="account-menu__link" href="#agreements">
          Agreements & documents
        </a>
        <a className="account-menu__link" href="#settings">
          Settings
        </a>
        <a className="account-menu__link" href="#sign-out">
          Sign out
        </a>
      </div>
    </details>
  );
}
export default AccountMenu;
