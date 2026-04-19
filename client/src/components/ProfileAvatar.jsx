import styles from '../styles/ProfileAvatar.module.css'
import { memo } from 'react';

const ProfileAvatar = ({ avatar }) => {  
  
  return (
    <>
    <div className={`${styles.avatar}`}>
      <img src={avatar} alt='' />
    </div>
    </>
  );
};

export default memo(ProfileAvatar)