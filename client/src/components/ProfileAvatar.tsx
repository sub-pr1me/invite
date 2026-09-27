import styles from '../styles/ProfileAvatar.module.css'
import useAuth from '../hooks/useAuth'
import { memo } from 'react'

type ProfileAvatarProps = { avatar: string, host: boolean, guest: boolean }

const ProfileAvatar = ({ avatar, host, guest }: ProfileAvatarProps) => {  
  const { auth } = useAuth();
  return (
    <>
      <div className={`${styles.avatar}`}>
        <img src={avatar} alt='' />      
        {auth?.roles[0] === 'venue' && host && <div className={`${styles.host_label}`}>H</div>}
        {auth?.roles[0] === 'venue' && guest && <div className={`${styles.guest_label}`}>G</div>}
      </div>
    </>
  );
};

export default memo(ProfileAvatar)