import React from "react";
import ReactDOM from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
} from "@tanstack/react-router";

import rootRoute from "./routes/rootRoute.tsx";
import PlaylistRoute from "./routes/playlistsRoute.tsx";
import AuthRoute from "./routes/authRoute.tsx";
import ModelRoute from "./routes/modelRoute.tsx";

const routeTree = rootRoute.addChildren([
  AuthRoute,
  PlaylistRoute.addChildren([ModelRoute]),
]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
