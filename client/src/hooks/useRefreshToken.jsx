import axios from "../api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
  
  const { setAuth } = useAuth();
  
  const refresh = async () => {
    try {
      const response = await axios.get(`/refresh`, 
        {
          withCredentials: true, 
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
      );
        if (response.data.roles[0] === 'venue') setAuth(prev => {
          console.log('SETTING VENUE AUTH');
          return {
            ...prev,
            token: response?.data?.accessToken,
            roles: response?.data?.roles,
            id: response?.data?.id,
            email: response?.data?.email,
            name: response?.data?.name,
            avatar: response?.data?.avatar,
            album: response?.data?.album,
            stage: response?.data?.stage,
            likes: response?.data?.likes,
            rating: response?.data?.rating,
            hours: response?.data?.hours,
            tables: response?.data?.tables,
            dates: response?.data?.dates,
            credits: parseInt(response?.data?.credits)
          }
        });
        if (response.data.roles[0] === 'customer') setAuth(prev => {
          console.log('SETTING CUSTOMER AUTH');
          return {
            ...prev,
            token: response?.data?.accessToken,
            roles: response?.data?.roles,
            id: response?.data?.id,
            email: response?.data?.email,
            name: response?.data?.name,
            avatar: response?.data?.avatar,
            album: response?.data?.album,
            stage: response?.data?.stage,
            likes: response?.data?.likes,
            dob: response?.data?.dob,
            gender: response?.data?.gender,
            interest: response?.data?.interest,
            dates: response?.data?.dates,
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