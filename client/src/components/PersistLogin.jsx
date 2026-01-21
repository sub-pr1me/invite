import { Outlet } from "react-router-dom"
import { useState, useEffect, useEffectEvent } from "react"
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from "../hooks/useAuth"

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();
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
  },[])

  useEffect(()=> {
    // console.log(`isLoading: ${isLoading}`);
    // console.log(`aT: ${auth?.token}`);
  }, [isLoading])

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