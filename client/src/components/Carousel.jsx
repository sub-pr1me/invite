import styles from '../styles/Carousel.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Image from './Image'
import { useParams } from 'react-router-dom'
import { memo, useEffect, useEffectEvent, useState } from 'react'

const Carousel = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { userId } = useParams();
  const [album, setAlbum] = useState(null);

  const applyAlbum = useEffectEvent(async (userId)=>{
    if (!userId) {
      setAlbum(auth.album);
    } else {
      try {
        const response = await axiosPrivate.get('/fetch_profile_data',
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true,
            params: {
              role: userId[0] === 'c' ? 'customer' : 'venue',
              id: userId[0] === 'c' ? userId?.substring(8) : userId?.substring(5)
            }
          }
        );
        setAlbum(response.data.album);
      } catch (err) {
        console.log(err);
      };
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
                cloudName={item.split('/')[3]}
                publicId={item.split('/')[7].split('.')[0]}
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
                key={album?.indexOf(item)}
                cloudName={item.split('/')[3]}
                publicId={item.split('/')[7].split('.')[0]}
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