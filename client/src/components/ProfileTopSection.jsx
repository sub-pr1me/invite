import styles from '../styles/ProfileTopSection.module.css'
import ProfileAvatar from './ProfileAvatar'
import ProfileLike from './ProfileLike'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useParams } from 'react-router-dom'
import { useEffect, useEffectEvent, useState, useCallback } from 'react';

const ProfileTopSection = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  const applyUserData = useEffectEvent(async (userId)=>{
    if (!userId) {
      setUserData(auth);
    } else {
      try {
        const response = await axiosPrivate.get('/fetch_profile_data',
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true,
            params: {
              role: userId[0] === 'c' ? 'customer' : 'venue',
              id: userId[0] === 'c' ? userId?.substring(8) : userId?.substring(5)
            }
          }
        );
        setUserData(response.data);
      } catch (err) {
        console.log(err);
      };
    };
  });

  const getAge = useCallback((dob) => {
    const date = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - date.getFullYear();
    const monthDifference = currentDate.getMonth() - date.getMonth();
    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < date.getDate())) {
        age--;
    };
    return age;
  },[]);

  const switchLike = useCallback(
    async (email) => {
      try {      
        const response = await axiosPrivate.post('/switch_like',
          {
            email: email,
            role: userId[0] === 'c' ? 'customer' : 'venue', 
            id: userId[0] === 'c' ? userId?.substring(8) : userId?.substring(5)},
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
        );

        if (userData) {setUserData({...userData, likes: response.data})};

      } catch (err) {
        console.log(err);
      };
    },[axiosPrivate, userData, userId]
  );

  useEffect(()=>{
    applyUserData(userId);
  },[userId]);

  return (
    <>
      <div className={styles.top_container}>
        <ProfileAvatar avatar={userData?.avatar}/>

        <div className={styles.name}>
          {!userId && auth.roles[0] === 'venue' ? auth.name : null}
          {!userId && auth.roles[0] === 'customer' ? `${auth.name} (${getAge(userData?.dob)})` : null}
          {userId && userData?.dob ? `${userData?.customer} (${getAge(userData?.dob)})` : null}
          {userId && !userData?.dob ? userData?.venue : null}
        </div>
        <div className={styles.hours}>{userData?.hours}</div>

        {userId && auth?.roles[0] !== 'venue' &&
        <ProfileLike 
          icon={userData?.dob ? 'heart' : 'star'} 
          liked={userData?.likes?.includes(auth.email)}
          switchLike={switchLike}/>
        }
      </div>
    </>
  );
};

export default ProfileTopSection;