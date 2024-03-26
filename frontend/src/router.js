import { createBrowserRouter } from "react-router-dom";
import Main from "./view/MainView";
import ProfileView from "./view/ProfileView";
import ProtectedRoutes from "./protectedRoutes";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/profile",
    element: <ProtectedRoutes />,
    children: [<ProfileView />],
  },
  {
    path: "*",
    element: <a>Not found</a>,
  },
]);

export default AppRouter;
