import styles from '../styles/Venues.module.css'
import { use } from 'react'
import useAuth from '../hooks/useAuth';

export default function Venues() {

  const { auth, venuesPromise } = useAuth();
  const fetched = use(venuesPromise);
  const venues = fetched.filter((ven) => ven.pics);  
  const getRandomKey = () => crypto.randomUUID();

  return (
    <>
      <div className={`${styles.container}
      ${auth ? styles.hidden : null}`}>
        <h4>POPULAR VENUES:</h4>
        <div className={`${styles.content}`}>
          <ul>{venues.map((item) => (
            <div key={item.id}>
              <div className={`${styles.item}`}>
                {item.pics.map((img) => (<img key={getRandomKey()} src={img} alt="IMAGE" />))}
              </div>
              <li>{item.venue}</li>
            </div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};