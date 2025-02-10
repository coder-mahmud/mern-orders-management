import React from 'react'
import { useVerifyMutation } from "../slices/userApiSlice";


const verifyUser = async  () => {
  const [verify] = useVerifyMutation();
  const apiRes = await verify({email})
  console.log("apiRes",apiRes)
  return apiRes;
}

export default verifyUser
