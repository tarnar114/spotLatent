import React, { useEffect, useState } from "react";
import Fetch from "./components/Fetch";
import axios from "axios";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
function App() {
  const [authToken, setAuthToken] = useState();

  const navigate = useNavigate();
  const queryStrings = window.location.search;
  const urlParams = new URLSearchParams(queryStrings);
  const code = urlParams.get("code");
  const verifier = window.sessionStorage.getItem("verifier");

  const fetchData = async () => {
    //fetch access
    const token=await axios
      .get("http://localhost:5000/token", {
        params: { code: code, verify: verifier },
      })
      .then((res) => res.data)
      .then((token) => {
        console.log(token)
        if (token.hasOwnProperty("access_token")) {
          //access token and code auth is finally done, now to actually get user data
          window.sessionStorage.setItem("access_token", token["access_token"]);
          window.sessionStorage.setItem(
            "refresh_token",
            token["refresh_token"]
          );
          window.sessionStorage.setItem("user_id", token["id"]);
        }
      })
      .finally(() => {
        navigate("/playlists");
      });
  };
  useEffect(() => {
    const authToken = window.sessionStorage.getItem("access_token");
    if (authToken === null) {
      if (code === null && verifier === null) {
        navigate("/");
      } else {
        fetchData();
      }
    } else {
      navigate("/playlists");
    }
  }, []);

  return (
    <div className="App">
      Layout
      <Outlet />
    </div>
  );
}

export default App;
