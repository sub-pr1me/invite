import styles from '../styles/ProfileAvatar.module.css'
import useAuth from '../hooks/useAuth'
import { memo } from 'react';

const ProfileAvatar = ({ avatar, host, guest }) => {  
  const { auth } = useAuth();
  return (
    <>
      <div className={`${styles.avatar}`}>
        <img src={avatar} alt='' />      
        {auth.roles[0] === 'venue' && host && <div className={`${styles.host_label}`}>H</div>}
        {auth.roles[0] === 'venue' && guest && <div className={`${styles.guest_label}`}>G</div>}
      </div>
    </>
  );
};

export default memo(ProfileAvatar)