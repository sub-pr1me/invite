import styles from '../styles/HomeScreen.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useEffectEvent } from 'react'
import ProfileTopSection from './ProfileTopSection'
import ProfileLikesSection from './ProfileLikesSection'
import Carousel from './Carousel'

const HomeScreen = () => {
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

  useEffect(()=>{
    applyUserData(userId);
  },[userId]);

  return (
    <>
      <div className={`${styles.homescreen_container}`}>
        <div className={`${styles.edge_fader}`}></div>        
        <Carousel />
        <ProfileTopSection userData={userData} setUserData={setUserData}/>
        <ProfileLikesSection userData={userData} setUserData={setUserData}/>
      </div>
    </>
  );
};

export default HomeScreen