import styles from '../styles/Auctions.module.css'
import useAuth from '../hooks/useAuth'
import { useState, useEffect, useEffectEvent } from 'react'
import SetAucs from './SetAucs'
import AuctionsMonitor from './AuctionsMonitor'

const Auctions = ({ setActive, auctions, setAuctions }) => {
  
  const [section, setSection] = useState('current');
  const { auth, customize } = useAuth();
  const onRefresh = useEffectEvent(()=>{setActive('auctions')});
  
  useEffect(()=>{
    onRefresh();
  },[]);

  return (
    <>
    <title>Auctions</title>
    <div className={`
      ${styles.auctions_container}
      ${auth.roles[0] === 'customer' ? styles.flex_start : null}`}>
      { 
        !customize && 
        <AuctionsMonitor
          section={section}
          setSection={setSection}
          auctions={auctions}
          setAuctions={setAuctions}
        />
      }
      <div className={`${styles.bottom}`}>
        {auth.roles[0] === 'venue' && 
        <SetAucs 
          setAuctions={setAuctions}
        />}
      </div>
    </div>
    </>
  );
};

export default Auctions