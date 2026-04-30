import styles from '../styles/EditGallery.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useEffectEvent, useState } from 'react';
import fileToDataString from '../utils/fileToDataString'
import Image from './Image'
import Thumb from './Thumb.jsx'

const EditGallery = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [status, setStatus] = useState('idle');
  const [files, setFiles] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [index, setIndex] = useState(0);
  const [red, setRed] = useState(false);
  const amount = auth.album?.length;

  const InitializePreview = useEffectEvent(()=>{setPreviewSrc(auth.album)});
  const MainPreview = useEffectEvent((pic)=>{setMainPreview(pic)});

  async function handleFilesChange(e) {
    const arr = Array.from(e.target.files);
    while (arr.length > 5) arr.pop();
    const arrData = [];
    const valid = ['image/jpeg', 'image/png'];
    try {
      for (let i=0; i<arr.length; i++) {
        if (valid.includes(arr[i].type)) arrData.push([arr[i], await fileToDataString(arr[i]), i]);
      }
      setPreviewSrc(arrData);
      setMainPreview(arrData[0])
      e.target.value = '';      

    } catch (err) {
      console.log('PREVIEW ERROR - ',err);
    }
  };

  function removePic(item) {    
    const arr = previewSrc;
    if (arr.length === 1) {
      setPreviewSrc(null);
      setMainPreview(null);
      return;
    };
    const index = previewSrc.indexOf(item);
    arr.splice(index, 1);
    setPreviewSrc(arr);
    setMainPreview(arr[0]);
    setIndex(0);
    setRed(false);
  };
  
  useEffect(()=>{
    if (auth.album?.length && !previewSrc) InitializePreview();
    if (previewSrc && !mainPreview) MainPreview(previewSrc[0]);
  },[auth.album, previewSrc, mainPreview]);
  
  return (
    <>
      <div className={`${styles.gallery_container}`}>

        <div className={`${styles.preview}`}>
          <div 
            className={`${styles.prev} ${index === 0 ? styles.no_show : null}`} 
            onClick={()=>{
              if (index > 0) {
                setIndex(index - 1);
                setMainPreview(previewSrc[index - 1]);
              } else {
                setIndex(previewSrc?.length - 1);
                setMainPreview(previewSrc[previewSrc?.length - 1]);
              };
            }}>
            <img src='../../img/arrow2.png' alt='' />
          </div>

          <div className={`${styles.preview_wrapper}`}>
            {mainPreview &&
              <Image 
                cloudName={mainPreview?.split('/')[3]}
                publicId={mainPreview?.split('/')[7].split('.')[0]}
                alt={''}
                profileGallery={true}
              />
            }
          </div>

          <div 
            className={`${styles.next} ${index === amount - 1 ? styles.no_show : null}`} 
            onClick={()=>{
              if (index + 1 < amount) {
                setIndex(index + 1);
                setMainPreview(previewSrc[index + 1]);
              } else {
                setIndex(0);
                setMainPreview(previewSrc[0]);
              };
            }}>
            <img src='../../img/arrow2.png' alt='' />
          </div>
        </div>
        
        <div className={`${styles.photos}`}>
          {
            previewSrc?.map(item => {
              return (
                <div className={`
                    ${styles.wrapper} 
                    ${previewSrc?.indexOf(item) === index ? styles.highlighted : null}`
                  }
                  onClick={()=>{
                    setIndex(previewSrc?.indexOf(item));
                    setMainPreview(previewSrc[previewSrc?.indexOf(item)]);
                  }}>

                  {previewSrc?.indexOf(item) === index &&
                    <div
                      className={`${styles.remove} ${red ? styles.red : null}`}
                      onMouseEnter={()=>{setRed(true)}} 
                      onMouseLeave={()=>{setRed(false)}}
                      onClick={(e) => {
                        e.stopPropagation();
                        removePic(mainPreview);
                      }}>
                      <img src='../../img/trash.png' alt='' />
                    </div>
                  }

                  <Thumb 
                    key={item}
                    cloudName={item.split('/')[3]}
                    publicId={item.split('/')[7].split('.')[0]}
                    alt={''}
                    profileGallery={true}
                    index={index}
                  />

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
              onChange={()=>{handleFilesChange}}/>
          </label>
          {auth.album.length 
          && auth.album !== previewSrc
          &&
            <button>Save Changes</button>
          }
        </div>
      </div>
    </>
  );
};

export default EditGallery