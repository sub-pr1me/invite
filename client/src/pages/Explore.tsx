import styles from '../styles/Explore.module.css'
import useProtectedApiClientWithTokenRefresh from '../hooks/useProtectedApiClientWithTokenRefresh'
import useAuth from '../hooks/useAuth'
import { useEffect, useEffectEvent, useState, memo } from 'react'
import UserProfile from '../components/UserProfile'
import { VenueType, CustomerType } from '../types'

const Explore = () => {
  const [venues, setVenues] = useState<VenueType[] | null>(null);
  const [customers, setCustomers] = useState<CustomerType[] | null>(null);
  const axiosPrivate = useProtectedApiClientWithTokenRefresh();
  const { auth, setActive } = useAuth();

  const FetchVenues = useEffectEvent(async () => {
    const response = await axiosPrivate.get('/fetch_venues',
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        withCredentials: true,
        params: {role: 'venue'}
      }
    );
    console.log('VENUE TYPEEEEEEEEEEEEEEEEEE', response.data);
    setVenues(response.data);
  });

  const FetchCustomers = useEffectEvent(async () => {
    // console.log('FETCHED CUSTOMERS!');
    const response = await axiosPrivate.get('/fetch_customers',
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        withCredentials: true,
        params: {role: 'customer'}
      }
    );
    const filtered = response.data.filter((item: CustomerType) => item.stage === "4");
    // console.log(filtered);
    setCustomers(filtered);
  });

  const onRefresh = useEffectEvent(()=>{setActive('explore')});

  useEffect(()=>{
    onRefresh();
  },[]);

  useEffect(() => {
    if (!venues) FetchVenues();
    if (!customers) FetchCustomers();
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
          {customers?.filter(item => item.email !== auth?.email 
          && item.gender === auth?.interest && item.interest === auth.gender)
            .map(item => {
              if (item.avatar) {
                return (
                  <UserProfile
                    role='customer' 
                    key={item.email}
                    name={item.customer}
                    avatar={item.avatar}
                    passedID={item.id}
                  />
                )
              }
            })
          }
        </div>
      </div>
    </div>
    </>   
  );
};

export default memo(Explore);