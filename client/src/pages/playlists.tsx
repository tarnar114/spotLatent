import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, } from "@tanstack/react-router";
import img from "../assets/no-img-play.png";
export default function Playlists() {
  const [playlists, setUserPlaylists] = useState();

  const playlistItems = (data: any) => {
    console.log(data)
    const items = data.map((item: any, index: number) => {
      const images = item["images"];
      const id = item["id"];
      if (images !== null) {
        const imgURL = images[0]["url"];
        return (
          <Link
            to="/model/$playlistId"
            params={{
              playlistId: id,
            }}
          >
            <Button
              variant="text"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img src={imgURL} width="100" alt="folder" />
              <label>Pictures</label>
            </Button>
          </Link>
        );
      }
      return (
        <Link
          to="/model/$playlistId"
          params={{
            playlistId: id,
          }}
        >
          <Button
            variant="text"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <img src={img} width="100" alt="folder" />
            <label>Pictures</label>
          </Button>
        </Link>
      );
    });
    return items;
  };
  const fetchData = async () => {
    const token = window.sessionStorage.getItem("access_token");
    console.log(token);
    const user_id = window.sessionStorage.getItem("user_id");
    console.log(user_id);
    const userPlaylists = await axios
      .get("/api/get_user_playlists", {
        params: { token: token, user_id: user_id },
      })
      .then((res) => res.data)
      .then((data) => {
        setUserPlaylists(data);
        console.log(data);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return playlists ? <div>{playlistItems(playlists)}</div> : <div>running</div>;
}
