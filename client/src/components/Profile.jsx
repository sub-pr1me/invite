import styles from '../styles/Profile.module.css'
import useAuth from '../hooks/useAuth'
import { useEffect, useEffectEvent } from 'react'

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
      PROFLIE SETTINGS
    </div>
    </>
  );
};

export default Profile