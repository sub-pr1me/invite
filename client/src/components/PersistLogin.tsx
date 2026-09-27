import { Outlet } from "react-router-dom"
import { useState, useEffect, useEffectEvent } from "react"
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from "../hooks/useAuth"

const PersistLogin = () => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();

  const verifyRefreshToken = async () => {
    try {
      await refresh();
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  };
  
  const persist = useEffectEvent(()=>{
    !auth?.token ? verifyRefreshToken() : setIsLoading(false)
  });

  useEffect(()=>{
    persist();
  },[]);

  useEffect(()=> {
    console.log(`isLoading: ${isLoading}`);
    console.log(`atToken: ${auth?.token}`);
  }, [isLoading, auth?.token]);

  return (
    <>
    {isLoading
      ? <p>Loading...</p>
      : <Outlet />
    }
    </>
  )
}

export default PersistLogin