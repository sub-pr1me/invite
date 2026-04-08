import styles from '../styles/HomeScreen.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useEffectEvent } from 'react';
import Thumb from './Thumb';

const HomeScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { userId } = useParams();

  let role;
  let id;
  let showLikes = false;
  if (userId) {role = userId[0] === 'c' ? 'customer' : 'venue'};
  if (role === 'customer') {id = userId?.substring(8)} else {id = userId?.substring(5)};
  if (!role && auth.roles[0] === 'venue') showLikes = true;
  if (role && role === 'venue') showLikes = true;
  
  
  function getAge(dob) {
    const date = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - date.getFullYear();
    const monthDifference = currentDate.getMonth() - date.getMonth();
    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < date.getDate())) {
        age--;
    };
    return age;
  }

  const FetchProfileData = useEffectEvent(async (role, id) => {
    try {
      const response = await axiosPrivate.get('/fetch_profile_data',
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true,
          params: {role: role, id: id}
        }
      );
      response.data.credits = parseInt(response.data.credits);
      if (role === 'venue') {
        response.data.name = response.data.venue;
        delete response.data.venue;
      };
      if (role === 'customer') {
        response.data.name = response.data.customer;
        response.data.age = getAge(response.data.dob)
        delete response.data.customer;
      };
      setProfileData(response.data);
    } catch (err) {
      console.log(err);
    };
  });

  useEffect(()=>{
    if (userId && !profileData) FetchProfileData(role, id);
  },[userId, profileData, role, id]);

  return (
    <>
      <div className={`${styles.homescreen_container}`}>
        <div className={`${styles.edge_fader}`}></div>
        <div className={`${styles.top}`}>
          <div className={`${styles.avatar}`}>
            <img src={auth && !role ? auth.avatar : profileData?.avatar} alt='' />
          </div>
          <div className={`${styles.name}`}>{auth && !role ? auth.name : profileData?.name}</div>
          <div className={`${styles.hours}`}>{auth && !role ? auth.hours : profileData?.hours}</div>
        </div>      
      
        <div className={`${styles.carousel}`}>
          <div className={`${styles.album}`}>
              {!role ?
                auth?.album?.map(item => {
                return (
                <Thumb
                  key={auth?.album?.indexOf(item)}
                  cloudName={item.split('/')[3]}
                  publicId={item.split('/')[7].split('.')[0]}
                  alt={''}
                />
                )})
                :
                profileData?.album?.map(item => {
                return (
                <Thumb
                  key={profileData?.album.indexOf(item)}
                  cloudName={item.split('/')[3]}
                  publicId={item.split('/')[7].split('.')[0]}
                  alt={''}
                />
                )})
              }           
          </div>
          <div className={`${styles.album}`} aria-hidden>
              {!role ?
                auth?.album?.map(item => {
                return (
                <Thumb
                  key={auth?.album?.indexOf(item)}
                  cloudName={item.split('/')[3]}
                  publicId={item.split('/')[7].split('.')[0]}
                  alt={''}
                />
                )})
                :
                profileData?.album?.map(item => {
                return (
                <Thumb
                  key={profileData?.album.indexOf(item)}
                  cloudName={item.split('/')[3]}
                  publicId={item.split('/')[7].split('.')[0]}
                  alt={''}
                />
                )})
              }           
          </div>
        </div>

        {showLikes &&
          <div className={`${styles.likes}`}>
            <div>People who like this place:</div>
            <div>{auth?.likes ? auth.likes : profileData?.likes}</div>
          </div>
        }
      </div>
    </>
  );
};

export default HomeScreen