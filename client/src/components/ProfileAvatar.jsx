import styles from '../styles/ProfileAvatar.module.css'
import useAuth from '../hooks/useAuth'
import { memo } from 'react';

const ProfileAvatar = ({ role, profileData }) => {
  const { auth } = useAuth();
  return (
    <>
    <div className={`${styles.avatar}`}>
      <img src={auth && !role ? auth.avatar : profileData?.avatar} alt='' />
    </div>
    </>
  )
}

export default memo(ProfileAvatar)