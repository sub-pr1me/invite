import styles from '../styles/Profile.module.css'
import { useEffect, useEffectEvent } from 'react'
import EditGallery from './EditGallery'

const Profile = ({ setActive }) => {
    
  const onRefresh = useEffectEvent(()=>{setActive('profile')});

  useEffect(()=>{
    onRefresh();
  },[]);

  return (
    <>
    <title>Profile</title>
    <div className={`${styles.profile_container}`}>
      <div className={`${styles.top}`}>
        <div className={``}>NAME</div>
        <div className={``}>EMAIL</div>
        <div className={``}>HOURS</div>
      </div>

      <EditGallery />
    </div>
    </>
  );
};

export default Profile