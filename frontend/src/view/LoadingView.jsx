import React from "react";
import Header from "../components/Header/Header";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../components/Loading/Loading";

const Main = () => {
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();
    return (
        <div>
            <Header></Header>
            <Loading></Loading>
        </div>
    );
};

export default Main;
