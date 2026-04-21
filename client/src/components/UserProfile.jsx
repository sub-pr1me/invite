import styles from '../styles/UserProfile.module.css'
import { useEffect, useEffectEvent, useState, memo } from 'react'
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const UserProfile = ({ email, role, setUserData, name, avatar, passedID }) => {

  const axiosPrivate = useAxiosPrivate();
  const [pic, setPic] = useState(null);
  const [id, setId] = useState(null);
  
  const FetchProfilePic = useEffectEvent(async (email) => {
    try {
      const response = await axiosPrivate.get('/fetch_avatar',
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true,
          params: {email: email, role: role}
        }
      );
      setPic(response.data.avatar);
      setId(`${role}${response.data.id}`);
    } catch (err) {
      console.log(err);
    };
  });

  useEffect(()=>{
    if (!pic && !avatar) FetchProfilePic(email);
  },[pic, email, avatar]);

  return (
    <>
      <div 
        className={`${styles.user_container}`}
        onClick={()=>{setTimeout(() => {setUserData(null)}, 0)}}>
        <Link to={`/dashboard/${passedID ? role+passedID : id}`}>
          <img src={pic ? pic : avatar} alt='' />
          {name &&
            <div>{name}</div>
          }
        </Link>   
      </div>
    </>
  );
};

export default memo(UserProfile);