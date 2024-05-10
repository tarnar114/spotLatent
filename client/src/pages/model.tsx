import { useEffect, useState } from "react";
import ModelRoute from "../routes/modelRoute";
import axios from "axios";
import ChartWithDimensions from "../components/graph/chart";
import { CircularProgress } from "@mui/material";
export default function Model() {
  const { playlistId } = ModelRoute.useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState()
  const fetchdata = async () => {
    const token = window.sessionStorage.getItem("access_token");

    await axios.get("/api/model", {
      params: { token: token, ID: playlistId }
    }).then(
      (res) => {
        console.log(res)
        setData(res.data)
        setLoading(false)
      }
    )
  }
  useEffect(() => {
    console.log(playlistId);
    fetchdata()
  }, []);
  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (<ChartWithDimensions data={data} />)}
    </div>
  )
}
