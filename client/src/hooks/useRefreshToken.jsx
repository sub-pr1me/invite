import axios from "../api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
  
  const { setAuth } = useAuth();
  
  const refresh = async () => {

    try {
      const response = await axios.get(`/refresh`, {withCredentials: true});
        if (response.data.roles[0] === 'venue') setAuth(prev => {
          return {
            ...prev,
            token: response?.data?.accessToken,
            roles: response?.data?.roles,
            email: response?.data?.email,
            name: response?.data?.name,
            avatar: response?.data?.avatar,
            album: response?.data?.album,
            stage: response?.data?.stage,
            rating: response?.data?.rating,
            hours: response?.data?.hours,
            tables: response?.data?.tables,
            credits: parseInt(response?.data?.credits)
          }
        });
        if (response.data.roles[0] === 'customer') setAuth(prev => {
          return {
            ...prev,
            token: response?.data?.accessToken,
            roles: response?.data?.roles,
            email: response?.data?.email,
            name: response?.data?.name,
            avatar: response?.data?.avatar,
            album: response?.data?.album,
            stage: response?.data?.stage,
            likes: response?.data?.likes,
            age: response?.data?.age,
            gender: response?.data?.gender,
            interest: response?.data?.interest,
            credits: parseInt(response?.data?.credits)
          }
        });

      
      return response.data.accessToken;

    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    };
  };
  return refresh;
};

export default useRefreshToken;