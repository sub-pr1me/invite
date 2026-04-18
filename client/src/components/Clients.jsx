import styles from '../styles/Clients.module.css'
import useAuth from '../hooks/useAuth'
import { useEffect, useEffectEvent } from 'react'

const Clients = ({ setActive }) => {

  const { auth } = useAuth();
  const onRefresh = useEffectEvent(()=>{setActive('clients')});

  useEffect(()=>{
    onRefresh();
  },[]);

  return (
    <>
    <title>Clients</title>
    <div className={`${styles.clients_container}`}>
      <div>Hosts</div>
      <div>Guests</div>
      <div>Explore People</div>
    </div>
    </>   
  );
};

export default Clients