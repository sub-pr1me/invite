import styles from '../styles/EditGallery.module.css'
import useAuth from '../hooks/useAuth'
import { useEffect, useEffectEvent, useState } from 'react';
import fileToDataString from '../utils/fileToDataString'
import Image from './Image'
import Thumb from './Thumb.jsx'

const EditGallery = () => {
  const { auth } = useAuth();
  const [status, setStatus] = useState('idle');
  const [files, setFiles] = useState(null);
  const [index, setIndex] = useState(0);
  const [red, setRed] = useState(false);
  const amount = auth.album?.length;
  
  useEffect(()=>{

  },[]);
  
  return (
    <>
      <div className={`${styles.gallery_container}`}>

        <div className={`${styles.preview}`}>

          <div 
            className={`${styles.prev} ${index === 0 ? styles.no_show : null}`} 
            onClick={()=>{}}>
            <img src='../../img/right-arrow.png' alt='' />
          </div>

          <div className={`${styles.preview_wrapper}`}>
            <img src={auth.album[index]} alt='' />
          </div>

          <div 
            className={`${styles.next} ${index === amount - 1 ? styles.no_show : null}`} 
            onClick={()=>{}}>
            <img src='../../img/right-arrow.png' alt='' />
          </div>
        </div>
        
        <div className={`${styles.photos}`}>
          {
            auth.album?.map(item => {
              return (
                <div className={`
                    ${styles.wrapper} 
                    ${auth.album?.indexOf(item) === index ? styles.highlighted : null}`
                  }
                  onClick={()=>{}}>

                  {auth.album?.indexOf(item) === index &&
                    <div
                      className={`${styles.remove} ${red ? styles.red : null}`}
                      onMouseEnter={()=>{setRed(true)}} 
                      onMouseLeave={()=>{setRed(false)}}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}>
                      <img src='../../img/trash.png' alt='' />
                    </div>
                  }

                  <img src={item} alt='' />

                </div>
              )
            })
          }
        </div>
        <div className={`${styles.buttons}`}>
          <label htmlFor='album' className={`${styles.label}`}>
            Upload More Images
            <input
              className={`${styles.upload}`}
              multiple
              type='file'
              id='album'
              name='album'
              onChange={()=>{}}/>
          </label>
          {auth.album.length
          &&
            <button>Save Changes</button>
          }
        </div>
      </div>
    </>
  );
};

export default EditGallery