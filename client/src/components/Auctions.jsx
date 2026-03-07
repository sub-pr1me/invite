import styles from '../styles/Auctions.module.css'
import useAuth from '../hooks/useAuth'
import { useEffect, useEffectEvent } from 'react'

const Auctions = ({ setActive }) => {
  
  const { auth } = useAuth();
  const onRefresh = useEffectEvent(()=>{setActive('auctions')});
  
  useEffect(()=>{
    onRefresh();
  },[]);

  return (
    <>
    <title>Auctions</title>
    <div className={`${styles.auctions_container}`}>
      <div>Active auctions</div>
      <div>Past auctions</div>
    </div>
    </>
  );
};

export default Auctions