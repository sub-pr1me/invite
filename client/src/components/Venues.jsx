import styles from '../styles/Venues.module.css'
import { use } from 'react';

export default function Venues({ venuesPromise }) {

  const venues = use(venuesPromise).filter((ven) => ven.pics);

  const getRandomKey = () => crypto.randomUUID();
  
  return (
    <>
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
    </>
  );
};