import { Box, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/no-img-play.png";
export default function Playlists() {
  const navigate=useNavigate()
  const [playlists, setUserPlaylists] = useState();
  const [loading, setLoading] = useState(true);
  const playlistItems = (data: any) => {
    const items = data.map((item: any, index: Number) => {
      const images = item["images"];
      if (images.length > 0) {
        const imgURL = images[0]["url"];
        return (
          <Button
            variant="text"
            style={{ display: "flex", flexDirection: "column" }}
            onClick={()=>{
              navigate('/model')
            }}
          >
            <img
              src={imgURL}
              width="100"
              alt="folder"
            />
            <label>Pictures</label>
          </Button>
        );
      }
      return (
        <Button
          variant="text"
          style={{ display: "flex", flexDirection: "column" }}

        >
          <img
            src={img}
            width="100"
            alt="folder"
          />
          <label>Pictures</label>
        </Button>
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
      .get("http://localhost:5000/get_user_playlists", {
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
