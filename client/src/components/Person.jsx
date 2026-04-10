import styles from '../styles/Person.module.css'
import { useEffect, useEffectEvent, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Person = ({ email, role, VisitProfile }) => {

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
      setId(`customer${response.data.id}`);
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
        className={`${styles.person_container}`}
        onClick={()=>{VisitProfile(id)}}>
        <img src={pic} alt='' />
      </div>    
    </>
  );
};

export default Person