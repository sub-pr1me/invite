import styles from '../styles/Auctions.module.css'
import useAuth from '../hooks/useAuth'
import { useState, useEffect, useEffectEvent } from 'react'
import SetAuctions from './SetAuctions'
import AuctionsMonitor from './AuctionsMonitor'

const Auctions = ({ setActive }) => {
  
  const [section, setSection] = useState('current');
  const { auth } = useAuth();
  const onRefresh = useEffectEvent(()=>{setActive('auctions')});
  
  useEffect(()=>{
    onRefresh();
  },[]);

  return (
    <>
    <title>Auctions</title>
    <div className={`${styles.auctions_container}`}>
      <AuctionsMonitor
        section={section}
        setSection={setSection}
      />
      <div className={`${styles.tables}`}>
        {auth.roles[0] === 'venue' && <SetAuctions />}
      </div>
    </div>
    </>
  );
};

export default Auctions