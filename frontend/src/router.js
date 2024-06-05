import { createBrowserRouter } from "react-router-dom";
import Main from "./view/MainView";
import ProfileView from "./view/user/ProfileView";
import ProtectedRoutes from "./protectedRoutes";
import EventView from "./view/eventView/EventView";
import CreateEventView from "./view/eventView/CreateEventView";
import YourIncommingView from "./view/eventView/YourIncommingView";
import PopularView from "./view/eventView/PopularView";
import RecomendedView from "./view/eventView/RecomendedView ";
import CommingView from "./view/eventView/CommingView";
import SearchView from "./view/eventView/SearchView";
import CurrentEventView from "./view/eventView/CurrentEventView";
import LoadingView from "./view/LoadingView";
import NotificationView from "./view/NotificationsView";
import EditProfileView from "./view/user/EditProfileView"

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
    path: "/edit-profile",
    element: <ProtectedRoutes />,
    children: [{ path: "", element: <EditProfileView /> }],
  },
  {
    path: "/login",
    element: <LoadingView />,
  },
  {
    path: "/search",
    element: <ProtectedRoutes />,
    children: [{ path: "", element: <SearchView /> }],
  },
  {
    path: "/notifications",
    element: <ProtectedRoutes />,
    children: [{ path: "", element: <NotificationView /> }],
  },
  {
    path: "*",
    element: <a>Not found</a>,
  },
]);

export default AppRouter;
