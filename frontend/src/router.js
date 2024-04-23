import { createBrowserRouter } from "react-router-dom";
import Main from "./view/MainView";
import ProfileView from "./view/ProfileView";
import ProtectedRoutes from "./protectedRoutes";
import EventView from "./view/EventView";
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
  { path: "/event", children: [{ path: "", element: <EventView></EventView> }] },
  {
    path: "*",
    element: <a>Not found</a>,
  },
]);

export default AppRouter;
