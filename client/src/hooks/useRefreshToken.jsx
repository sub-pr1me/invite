import axios from "../api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
  
  const { setAuth } = useAuth();
  
  const refresh = async () => {
    const response = await axios.get(`/refresh`, {
      withCredentials: true
    });

    setAuth(prev => {
      // console.log('OLD TOKEN - ', prev);
      // console.log('NEW TOKEN - ', response.data.accessToken);
      return { ...prev, token: response.data.accessToken }
    });
    return response.data.accessToken;
  } 

  return refresh;
};

export default useRefreshToken;