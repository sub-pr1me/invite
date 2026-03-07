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
      <div>Change name</div>
      <div>Change email</div>
      <div>Change photos</div>
      <div>Change tables (venue)</div>
    </div>
    </>
  );
};

export default Profile