import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
} from "@tanstack/react-router";
import  rootRoute  from "./rootRoute";
import Playlists from "../pages/playlists";
const PlaylistRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/playlists",
  component: Playlists,
});
export default PlaylistRoute;
