import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Navigate, Outlet, useNavigate } from "react-router-dom";
import NotLoggedInView from "./view/NotLogin";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  return isAuthenticated ? <Outlet /> : <NotLoggedInView></NotLoggedInView>
  ;
};
export default ProtectedRoutes;
