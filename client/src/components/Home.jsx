import useAuth from '../hooks/useAuth'
import { useEffect, useEffectEvent } from 'react';

const Home = () => {

  const { auth } = useAuth();
  const onRefresh = useEffectEvent(()=>{console.log(auth)});
  
  useEffect(()=>{
    onRefresh();
  },[])

  return (
    <>
    <title>Home</title>
    <div>Home</div>
    </>    
  )
}

export default Home