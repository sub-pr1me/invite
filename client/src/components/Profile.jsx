import styles from '../styles/Profile.module.css'
import useAuth from '../hooks/useAuth'
import { useEffect, useEffectEvent, useState } from 'react'
import EditGallery from './EditGallery'
import EditProfile from './EditProfile';


const Profile = () => {
  const [previewSrc, setPreviewSrc] = useState(null);
  const [showUploadAnimation, SetShowUploadAnimation] = useState(false);
  const [fade, setFade] = useState(false);
  const [hidden, setHidden] = useState(true);
  const { auth, setActive } = useAuth();

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editHours, setEditHours] = useState(false);
  const [editDelete, setEditDelete] = useState(false);
    
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
        
        {editName && 
        <div className={`${styles.name_modal}`}>
          <EditProfile 
            title={'Enter new name:'}
            state={editName} 
            setState={setEditName}
            variable={'name'}
            type={'text'}/>
        </div>
        }        
        <div className={`${styles.edit_name}`}>
            <button className={``} onClick={()=>{setEditName(!editName)}}>
              Edit Name
            </button>
        </div>
        
        {editEmail && 
        <div className={`${styles.email_modal}`}>
          <EditProfile 
            title={'Enter new email:'}
            state={editEmail} 
            setState={setEditEmail}
            variable={'email'}
            type={'email'}/>
        </div>
        }        
        <div className={`${styles.edit_email}`} onClick={()=>{setEditEmail(!editEmail)}}>
          <button className={``}>
            Edit Email
          </button>
        </div>
        
        {editHours && <div className={`${styles.hours_modal}`}>
          <EditProfile 
            title={'Enter new hours:'}
            state={editHours} 
            setState={setEditHours}
            variable={'hours'}/>
        </div>
        }
        {auth.roles[0] === 'venue' &&
          <div className={`${styles.edit_hours}`}>
            <button className={``} onClick={()=>{setEditHours(!editHours)}}>
              Edit Hours
            </button>
          </div>
        }

        {editDelete && <div className={`${styles.delete_modal}`}>
          <EditProfile 
            title={'Delete account?'}
            state={editDelete} 
            setState={setEditDelete}
            variable={'delete'}
            btn={`Delete`}/>
        </div>
        }
        <div className={`${styles.delete_acc}`}>
          <button className={``} onClick={()=>{setEditDelete(!editDelete)}}>
            Delete Account
          </button>
        </div>
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