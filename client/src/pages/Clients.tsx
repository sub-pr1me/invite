import styles from '../styles/Clients.module.css'
import useAuth from '../hooks/useAuth'
import useProtectedApiClientWithTokenRefresh from '../hooks/useProtectedApiClientWithTokenRefresh'
import { useEffect, useEffectEvent, useState, memo } from 'react'
import UserProfile from '../components/UserProfile'
import { DateType, CustomerType } from '../types'

const Clients = () => {
  const [customers, setCustomers] = useState<CustomerType[] | null>(null);
  const [hosts, setHosts] = useState<string[] | null>(null);
  const [guests, setGuests] = useState<string[] | null>(null);
  const axiosPrivate = useProtectedApiClientWithTokenRefresh();
  const { auth, setActive } = useAuth();

  const FetchCustomers = useEffectEvent(async () => {
    const response = await axiosPrivate.get('/fetch_customers',
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        withCredentials: true,
        params: {role: 'customer'}
      }
    );
    setCustomers(response.data);
    let hostArr = [];
    let guestArr = [];
    for (const item of response.data) {
      const host = item.dates?.find((obj: DateType) => obj.venue === auth?.email && obj.host === item.email);
      if (host) hostArr.push(item.email);
      const guest = item.dates?.find((obj: DateType) => obj.venue === auth?.email && obj.guest === item.email);
      if (guest) guestArr.push(item.email);
    };
    if (hostArr.length) setHosts(hostArr);
    if (guestArr.length) setGuests(guestArr);
  });

  const onRefresh = useEffectEvent(()=>{setActive('clients')});

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
          {customers?.map((item: CustomerType) => {
            if (item.avatar) {
              return (
                <UserProfile
                  role='customer' 
                  key={item.email}
                  name={item.customer}
                  avatar={item.avatar}
                  passedID={item.id}
                  host={hosts?.includes(item.email) ? true : false}
                  guest={guests?.includes(item.email) ? true : false}
                />
              )
            }
          })}
        </div>
      </div>
    </div>
    </>   
  );
};

export default memo(Clients);