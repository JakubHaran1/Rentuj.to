import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

function RequireAuth() {
  const { user, authStatus } = useUserContext();

  if (authStatus === "loading") {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
