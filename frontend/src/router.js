import { createBrowserRouter } from "react-router-dom";
import Main from "./view/MainView";
import ProfileView from "./view/ProfileView";
import ProtectedRoutes from "./protectedRoutes";
import EventView from "./view/EventView";
import CreateEventView from "./view/CreateEventView";
import YourIncommingView from "./view/YourIncommingView";
import PopularView from "./view/PopularView";
import RecomendedView from "./view/RecomendedView ";
import CommingView from "./view/CommingView";
import SearchView from "./view/SearchView";
import CurrentEventView from "./view/CurrentEventView";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/event",
    element: <ProtectedRoutes />,
    children: [
      { path: "", element: <EventView></EventView> },
      { path: ":id", element: <CurrentEventView></CurrentEventView> },
      { path: "create", element: <CreateEventView /> },
      { path: "yourincomming", element: <YourIncommingView /> },
      { path: "popular", element: <PopularView /> },
      { path: "recomended", element: <RecomendedView /> },
      { path: "comming", element: <CommingView /> },
    ],
  },
  {
    path: "/profile",
    element: <ProtectedRoutes />,
    children: [{ path: "", element: <ProfileView /> }],
  },
  {
    path: "/search",
    element: <ProtectedRoutes />,
    children: [{ path: "", element: <SearchView /> }],
  },
  {
    path: "*",
    element: <a>Not found</a>,
  },
]);

export default AppRouter;
