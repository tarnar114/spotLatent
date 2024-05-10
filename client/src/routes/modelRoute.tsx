import {
  Route,
} from "@tanstack/react-router";
import { } from 'mpld3'
import Model from "../pages/model";
import rootRoute from "./rootRoute";

const ModelRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/model/$playlistId",
  component: Model
});
export default ModelRoute;
