import styles from '../styles/Carousel.module.css'
import useAuth from '../hooks/useAuth'
import Image from './Image'
import { useParams } from 'react-router-dom'
import { memo, useEffect, useEffectEvent, useState } from 'react'

const Carousel = ({ userData }) => {
  const { auth } = useAuth();
  const { userId } = useParams();
  const [album, setAlbum] = useState(null);

  const applyAlbum = useEffectEvent(async (userId)=>{
    if (!userId) {
      setAlbum(auth.album);
    } else {
      setAlbum(userData?.album);
    };
  });

  useEffect(()=>{
    applyAlbum(userId);
  },[userId]);

  return (
    <>
    <div className={`${styles.carousel}`}>
      <div className={`
        ${styles.album}
        ${album?.length === 1 ? styles.length1 : null}
        ${album?.length === 2 ? styles.length2 : null}
        ${album?.length === 3 ? styles.length3 : null}
        ${album?.length === 4 ? styles.length4 : null}
        ${album?.length === 5 ? styles.length5 : null}`}
      >
        {
          album?.map(item => {
            return (
              <Image
                key={album?.indexOf(item)}
                src={item}
                alt={''}
              />
            )
          })
        }           
      </div>
      <div className={`
          ${styles.album}
          ${album?.length === 1 ? styles.length1 : null}
          ${album?.length === 2 ? styles.length2 : null}
          ${album?.length === 3 ? styles.length3 : null}
          ${album?.length === 4 ? styles.length4 : null}
          ${album?.length === 5 ? styles.length5 : null}`} 
          aria-hidden
        >
        {
          album?.map(item => {
            return (
              <Image
                key={JSON.stringify(item)}
                src={item}
                alt={''}
              />
            )
          })
        }           
      </div>
    </div>
    </>
  );
};

export default memo(Carousel);