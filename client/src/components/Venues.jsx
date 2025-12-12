import styles from '../styles/Venues.module.css'
import { use } from 'react';

export default function Venues({ venuesPromise }) {

  const venues = use(venuesPromise);

  const getRandomKey = () => {
    return crypto.randomUUID();
  }
  
  return (
    <>
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
    </>
  );
};