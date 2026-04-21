import styles from '../styles/Explore.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useEffect, useEffectEvent, useState, memo } from 'react'
import UserProfile from './UserProfile'

const Explore = ({ setActive }) => {
  const [venues, setVenues] = useState(null);
  const [customers, setCustomers] = useState(null);

  const onRefresh = useEffectEvent(()=>{setActive('explore')});
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const FetchVenues = useEffectEvent(async () => {
    const response = await axiosPrivate.get('/fetch_venues',
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        withCredentials: true,
        params: {role: 'venue'}
      }
    );
    setVenues(response.data);
  });

  const FetchCustomers = useEffectEvent(async () => {
    const response = await axiosPrivate.get('/fetch_customers',
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        withCredentials: true,
        params: {role: 'customer'}
      }
    );
    setCustomers(response.data);
  });

  useEffect(()=>{
    onRefresh();
  },[]);

  useEffect(() => {
    if (!venues) FetchVenues();
    if (!customers) FetchCustomers();
    console.log('VENUES',venues);
  }, [venues, customers]);

  return (
    <>
    <title>Explore</title>
    <div className={`${styles.explore_container}`}>
      <div className={`${styles.venues}`}>
        <div className={`${styles.label}`}>Explore Venues:</div>
        <div className={`${styles.venues_content}`}>
          {
            venues?.map(item => {
              return (
                <UserProfile 
                  email={item.email} 
                  role='venue' 
                  key={item.email}
                  name={item.venue}
                  avatar={item.avatar}
                  passedID={item.id}
                />
              )
            })
          }
        </div>
      </div>
      <div className={`${styles.people}`}>
        <div className={`${styles.label}`}>Explore People:</div>
        <div className={`${styles.people_content}`}>
          {customers?.filter(item => item.email !== auth.email 
          && item.gender === auth.interest && item.interest === auth.gender)
            .map(item => {
              return (
                <UserProfile 
                  email={item.email} 
                  role='customer' 
                  key={item.email}
                  name={item.customer}
                  avatar={item.avatar}
                  passedID={item.id}
                />
              )
            })
          }
        </div>
      </div>
    </div>
    </>   
  );
};

export default memo(Explore);