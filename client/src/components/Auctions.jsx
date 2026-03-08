import styles from '../styles/Auctions.module.css'
import useAuth from '../hooks/useAuth'
import { useEffect, useEffectEvent } from 'react'
import SetAuctions from './SetAuctions'

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
      {auth.roles[0] === 'venue' && <SetAuctions />}
    </div>
    </>
  );
};

export default Auctions