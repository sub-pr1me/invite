import axios from "../api/axios";

export default async function UserLogIn(email, password){
  
  const response = await axios.post("/login",
  {email: email, password: password},
  {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    withCredentials: true
  });  
  
  return response;
}