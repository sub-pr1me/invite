import axios from "../api/axios";

export default async function UserSignIn(email, password){
  
  const response = await axios.post("/sign_in",
  {email: email, password: password},
  {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    withCredentials: true
  });  
  
  return response;
}