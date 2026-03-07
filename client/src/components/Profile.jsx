import styles from '../styles/Profile.module.css'
import useAuth from '../hooks/useAuth'
import { useEffect, useEffectEvent } from 'react'
import SetAuctions from './SetAuctions'

const Profile = ({ setActive }) => {
    
  const { auth } = useAuth();
  const onRefresh = useEffectEvent(()=>{setActive('profile')});

  useEffect(()=>{
    onRefresh();
  },[]);

  return (
    <>
    <title>Profile</title>
    <div className={`${styles.profile_container}`}>
      {auth.roles[0] === 'venue' && <SetAuctions />}
    </div>
    </>
  );
};

export default Profile