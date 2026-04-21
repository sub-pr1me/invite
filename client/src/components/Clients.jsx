import styles from '../styles/Clients.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useEffectEvent, useState, memo } from 'react'
import UserProfile from './UserProfile'

const Clients = ({ setActive }) => {
  const [customers, setCustomers] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const onRefresh = useEffectEvent(()=>{setActive('clients')});

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
    if (!customers) FetchCustomers();
  }, [customers]);

  return (
    <>
    <title>Clients</title>
    <div className={`${styles.clients_container}`}>
      <div className={`${styles.people}`}>
        <div className={`${styles.label}`}>Explore People:</div>
        <div className={`${styles.people_content}`}>
          {customers?.map(item => {
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

export default memo(Clients);