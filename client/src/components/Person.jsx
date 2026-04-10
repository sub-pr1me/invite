import styles from '../styles/Person.module.css'
import { useEffect, useEffectEvent, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'

const Person = ({ email, role }) => {

  const axiosPrivate = useAxiosPrivate();
  const [pic, setPic] = useState(null);
  const [id, setId] = useState(null);
  const navigate = useNavigate();
  
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
      setId(response.data.id);
    } catch (err) {
      console.log(err);
    };
  });

  useEffect(()=>{
    if (!pic) FetchProfilePic(email)
  },[pic, email]);

  return (
    <>
      <div 
        className={`${styles.person_container}`}>
        <img src={pic} alt='' />
      </div>    
    </>
  );
};

export default Person