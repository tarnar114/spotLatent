import axios from "axios";
import Fetch from "../components/Fetch";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

/*landing page for when user has to authorize  */
export default function Auth() {
  const queryStrings = window.location.search;
  const urlParams = new URLSearchParams(queryStrings);
  const code = urlParams.get("code");
  const verifier = window.sessionStorage.getItem("verifier");
  const navigate = useNavigate({ from: "/" });
  const fetchData = async () => {
    console.log(code);
    console.log(verifier);
    const token = await axios
      .get("/api/token", {
        params: { code: code, verify: verifier },
      })
      .then((res) => res.data)
      .then((token) => {
        console.log(token);
        if (token.hasOwnProperty("access_token")) {
          //access token and code auth is finally done, now to actually get user data
          console.log(token);
          window.sessionStorage.setItem("access_token", token["access_token"]);
          window.sessionStorage.setItem(
            "refresh_token",
            token["refresh_token"]
          );
          window.sessionStorage.setItem("user_id", token["id"]);
        }
      })
      .finally(() => {
        navigate({ to: "/playlists" });
      });
  };
  const chooseNaivation = () => {
    const auth = window.sessionStorage.getItem("access_token");
    console.log(auth);
    if (auth === null) {
      if (code != null && verifier != null) {
        {
          fetchData();
        }
      }
    } else {
      navigate({ to: "/playlists" });
    }
  };
  useEffect(() => {
    chooseNaivation();
  }, []);
  return (
    <div>
      auth
      <Fetch />
    </div>
  );
}
