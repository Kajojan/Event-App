import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  console.log(isAuthenticated);
  return isAuthenticated ? <Outlet /> : <a>Not Log in</a>;
};

export default ProtectedRoutes;
