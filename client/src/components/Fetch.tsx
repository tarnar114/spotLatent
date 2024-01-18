import React from 'react'
import { Button } from "@mui/material";
import axios from 'axios'
export default function Fetch() {
  const data=async()=>{
    localStorage.clear()
    const res=await axios.post('http://localhost:5000/verifier').then(res=>res.data)
    console.log(res)
    window.sessionStorage.setItem('verifier',res)
    const userAuth=await axios.get("http://localhost:5000/auth",{params:{auth:res}}).then(res=>res.data)
    window.location.href=userAuth
   
  } 
  return (
    <Button variant='outlined' onClick={data}>
      verify
    </Button>
  )
}
