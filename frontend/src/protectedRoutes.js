import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0();

  return isAuthenticated ? <Outlet /> : loginWithRedirect();
};

export default ProtectedRoutes;
