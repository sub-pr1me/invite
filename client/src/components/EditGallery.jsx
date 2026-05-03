import styles from '../styles/EditGallery.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useEffectEvent, useState } from 'react'
import fileToDataString from '../utils/fileToDataString'
import Image from './Image';
import Thumb from './Thumb';

const EditGallery = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [status, setStatus] = useState('idle');
  const [files, setFiles] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);

  const InitializePreview = useEffectEvent(()=>{
    const arr = [];
    for (let i=0; i<auth.album.length; i++) {
      arr.push({ pic: auth.album[i], index: i, file: null });
    };
    setPreviewSrc(arr);
    setMainPreview(arr[0]);
  });

  function removePic(item) {
    setStatus('change');
    const arr = previewSrc;
    if (arr.length === 1) {
      setPreviewSrc(null);
      setMainPreview(null);
      return;
    };
    const index = previewSrc.indexOf(item);
    arr.splice(index, 1);
    const newArr = [];
    for (let i=0; i<arr.length; i++) {
      newArr.push({ pic: arr[i].pic, index: i, dataString: arr[i].dataString })
    };
    setPreviewSrc(newArr);
    setMainPreview(newArr[0]);
  };

  async function handleFilesChange(e) {
    if (status !== 'change') setStatus('change');

    const arr = Array.from(e.target.files);
    
    while (arr.length > 5 - previewSrc.length) arr.pop();
    
    const arrData = [];
    const valid = ['image/jpeg', 'image/png'];
    
    try {
      for (let i=0; i<arr.length; i++) {
        const str = await fileToDataString(arr[i]);
        if (valid.includes(arr[i].type)) { arrData.push({ pic: str, index: i, file: arr[i] }) }
      };
      
      for (let i=0; i<previewSrc.length; i++) { 
        arrData.push({ pic: previewSrc[i].pic, index: arrData.length, file: previewSrc[i].file }) 
      };
      
      setPreviewSrc(arrData);
      setTimeout(() => {setMainPreview(arrData[0])}, 1000);
      e.target.value = '';

    } catch (err) {
      console.log('PREVIEW ERROR - ', err);
    }
  };

  function extractFiles() {
    let arr = [];
    for (let i=0; i<previewSrc.length; i++) {
      arr.push(previewSrc[i][0]);
    };
    setFiles(arr);
    setPreviewSrc(null);
  };

  const resetStatus = useEffectEvent(()=>{
      setFiles(null);
      setStatus('idle');
      setPreviewSrc(null);
  });

  
  useEffect(()=>{
    if (!previewSrc && status === 'idle') InitializePreview();
    if (status === 'success') resetStatus();
  },[previewSrc, status]);
  
  return (
    <>
      <div className={`${styles.gallery_container}`}>

        <div className={`${styles.preview}`}>
          
          {!mainPreview && <div className={styles.empty}>Your gallery is empty</div>}
          
          
          {mainPreview &&
          <div className={`${styles.prev}`} 
            onClick={()=>{
              const index = previewSrc?.indexOf(mainPreview);
              if (index > 0) {setMainPreview(previewSrc[index - 1])
              } else {setMainPreview(previewSrc[previewSrc?.length - 1])}
            }}>
            <img src='../../img/right-arrow.png' alt='' />          
          </div>}

          {mainPreview &&
          <div className={`${styles.preview_wrapper}`}>
            {mainPreview?.pic.includes('cloudinary') &&
              <Image src={mainPreview?.pic} alt={'Main Preview'}/>
            }
            
            {!mainPreview?.pic.includes('cloudinary') &&
              <img src={mainPreview?.pic} alt={'Main Preview'}/>
            }
          </div>}
          
          {mainPreview &&
          <div className={`${styles.next}`} 
            onClick={()=>{
              const index = previewSrc?.indexOf(mainPreview);
              if (index < previewSrc?.length - 1) {setMainPreview(previewSrc[index + 1])
              } else {setMainPreview(previewSrc[0])}
            }}>
            <img src='../../img/right-arrow.png' alt='' loading='lazy' />
          </div>}
            
        </div>
        
        <div className={`${styles.photos}`}>
          {
            previewSrc?.map(item => {
              return (
                <div className={`
                    ${styles.photos_wrapper} 
                    ${previewSrc?.indexOf(item) === mainPreview?.index ? styles.highlighted : null}`
                  }
                  onClick={()=>{setMainPreview(previewSrc[item.index])}}>
                  
                  {previewSrc?.indexOf(item) === mainPreview?.index &&
                    <div className={styles.bg}></div>
                  }
                  {previewSrc?.indexOf(item) === mainPreview?.index &&
                    <div
                      className={`${styles.remove}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removePic(mainPreview);
                      }}>
                      <img key={item.pic} src='../../img/trash.png' alt='' />
                    </div>
                  }

                  {item?.pic.includes('cloudinary') &&
                    <Thumb src={item?.pic} alt={'Main Preview'}/>
                  }

                  {!item?.pic.includes('cloudinary') &&
                    <img src={item?.pic} alt={'Main Preview'}/>
                  }

                </div>
              )
            })
          }
        </div>
        <div className={`${styles.buttons}`}>

          {previewSrc?.length > 4 &&
            <div className={`${styles.full}`}>
              The maximum gallery size is 5 images.
              <br />
              Delete some photos to upload new ones.
            </div>
          }

          {status === 'change' &&
            <button onClick={()=>{
              setStatus('idle');
              setPreviewSrc(null);
            }}
            >Cancel</button>
          }

          {previewSrc?.length !== 5 &&
            <label htmlFor='album' className={`${styles.label}`}>
              Upload Images
              <input
                className={`${styles.upload}`}
                multiple
                type='file'
                id='album'
                name='album'
                onChange={handleFilesChange}/>
            </label>
          }

          {status === 'change' &&
            <button onClick={()=> {extractFiles()}}>
              Save
            </button>
          }
        </div>
      </div>
    </>
  );
};

export default EditGallery