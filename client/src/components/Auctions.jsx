import styles from '../styles/Auctions.module.css'
import useAuth from '../hooks/useAuth'
import { useState, useEffect, useEffectEvent } from 'react'
import SetAuctions from './SetAuctions'
import AuctionsMonitor from './AuctionsMonitor'

const Auctions = ({ setActive }) => {
  
  const [section, setSection] = useState('current');
  const [auctions, setAuctions] = useState(null);
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
      <div className={`${styles.tables}`}>
        {auth.roles[0] === 'venue' && 
        <SetAuctions 
          setAuctions={setAuctions}
        />}
      </div>
    </div>
    </>
  );
};

export default Auctions