import styles from '../styles/Profile.module.css'
import { useEffect, useEffectEvent, useState } from 'react'
import EditGallery from './EditGallery'

const Profile = ({ setActive }) => {
  const [previewSrc, setPreviewSrc] = useState(null);
  const [showUploadAnimation, SetShowUploadAnimation] = useState(false);
  const [fade, setFade] = useState(false);
  const [hidden, setHidden] = useState(true);
    
  const onRefresh = useEffectEvent(()=>{setActive('profile')});

  useEffect(()=>{
    onRefresh();
  },[]);

  return (
    <>
    <title>Profile</title>
    {showUploadAnimation && 
      <div className={`
        ${styles.loading} 
        ${hidden ? styles.hidden : null}
        ${fade ? styles.fade : null}`}>         
          <div>
            <img src='../../img/loading.gif' alt='PLEASE WAIT' />
            <br />
            <div>LOADING...</div>
          </div>        
      </div>      
    }

    <div className={`${styles.profile_container}`}>
      <div className={`${styles.top}`}>
        <button className={``}>Edit Name</button>
        <button className={``}>Edit E-mail</button>
        <button className={``}>Edit Hours</button>
        <button className={``}>Delete Account</button>
      </div>

      <EditGallery
        SetShowUploadAnimation={SetShowUploadAnimation}
        previewSrc={previewSrc}
        setPreviewSrc={setPreviewSrc}
        setFade={setFade}
        setHidden={setHidden}
      />
    </div>
    </>
  );
};

export default Profile