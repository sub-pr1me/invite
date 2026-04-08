import styles from '../styles/HomeScreen.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useEffectEvent } from 'react';

const HomeScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { userId } = useParams();

  let role;
  let id;
  if (userId) {role = userId[0] === 'c' ? 'customer' : 'venue'};
  if (role === 'customer') {id = userId?.substring(8)} else {id = userId?.substring(5)};

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
      console.log(response.data);
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
        {role && <div><img src={profileData?.avatar} alt='' /></div>}
        {role && <div>Name: {profileData?.name}</div>}
        {role === 'customer' && <div>Age: {profileData ? getAge(profileData.dob) : null}</div>}
        {role && <div>Balance: {profileData?.credits}</div>}
        {role && <div>Photos: {profileData?.album}</div>}
        {role && <div>Likes: {profileData?.likes}</div>}
        {role && <div>Dates: {profileData?.dates}</div>}

        {!role && <div className={`${styles.avatar}`}><img src={auth.avatar} alt='' /></div>}
        {!role && <div className={`${styles.name}`}>{auth.name}</div>}
        {!role && <div className={`${styles.hours}`}>{auth.hours}</div>}
        <br />
        {!role && 
          <div className={`${styles.album}`}>
            Photos:
            <div>{auth.album.map(item => {return (<img key={`${auth.name}${auth.album.indexOf(item)}`} src={item} alt='' />)})}</div>            
          </div>}
          <br />
        {/* {!role && 
          <div className={`${styles.album}`}>
            Tables:
            <div>{auth.tables.map(item => {return (<img key={item.id} src={item.pic ? item.pic : null} alt='' />)})}</div>            
          </div>} */}
        {!role && <div className={`${styles.likes}`}>People who like this place:{auth.likes}</div>}
      </div>
    </>
  );
};

export default HomeScreen