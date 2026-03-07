import styles from '../styles/Explore.module.css'
import useAuth from '../hooks/useAuth'
import { useEffect, useEffectEvent } from 'react'

const Explore = ({ setActive }) => {

  const { auth } = useAuth();
  const onRefresh = useEffectEvent(()=>{setActive('explore')});

  useEffect(()=>{
    onRefresh();
  },[]);

  return (
    <>
    <title>Explore</title>
    <div className={`${styles.explore_container}`}>
      <div>Explore Venues</div>
      <div>Explore People</div>
    </div>
    </>   
  );
};

export default Explore