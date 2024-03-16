import "./App.css";
import apiData from "./services/apiData";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth0();
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  // apiData
  //   .getPersons("kajo")
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((err) => {
  //     console.log("error: --- ", err);
  //   });
  return (
    <div className="App">
      <h1>Hello</h1>
      {!isAuthenticated && <button onClick={() => loginWithRedirect()}>Log in</button>}
      {isAuthenticated && (
        <div>
          {" "}
          <button onClick={() => logout()}>Log out</button> <h2>{user.name}</h2>
          <p>{user.email}</p>{" "}
        </div>
      )}
    </div>
  );
}

export default App;
