import {
  Route,
} from "@tanstack/react-router";
import rootRoute from "./rootRoute";
import Auth from "../pages/auth";

const AuthRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Auth,
});
export default AuthRoute;
