import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Auth from './pages/auth';
import Playlists from './pages/playlists';
import{
 Route, createBrowserRouter, createRoutesFromElements,RouterProvider, createRoutesFromChildren
} from "react-router-dom"
const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route element={<App/>}>
      <Route path="/" element={<Auth/>}/>
      <Route path="/playlists" element={<Playlists/>}/>
    </Route>
    
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);
