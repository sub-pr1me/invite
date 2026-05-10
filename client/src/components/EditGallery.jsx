import styles from '../styles/EditGallery.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useEffectEvent, useState } from 'react'
import fileToDataString from '../utils/fileToDataString'
import Image from './Image';
import Thumb from './Thumb';

const EditGallery = ({ previewSrc, setPreviewSrc, SetShowUploadAnimation, setHidden }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth} = useAuth();
  const [status, setStatus] = useState('idle');
  const [files, setFiles] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [empty, setEmpty] = useState(false);
  const [toRemove, setToRemove] = useState([]);

  const InitializePreview = useEffectEvent(()=>{
    setTimeout(() => { SetShowUploadAnimation(false) }, 2500);
    const arr = [];    
    for (let i=0; i<auth.album.length; i++) {
      arr.push({ pic: auth.album[i], index: i, file: null });
    };
    setPreviewSrc(arr);
    setMainPreview(arr[0]);
    setStatus('idle');
    setEmpty(false);
  });

  function removePic(item) {
    setStatus('change');
    const arr = previewSrc;

    if (arr.length === 1) {
      setToRemove([...toRemove, arr[0].pic]);
      setPreviewSrc(null);
      setMainPreview(null);
      setEmpty(true);
      return;
    };

    const index = previewSrc?.indexOf(item);
    const removed = arr.splice(index, 1);
    setToRemove([...toRemove, removed[0].pic]);

    const newArr = [];
    for (let i=0; i<arr.length; i++) {
      newArr.push({ pic: arr[i].pic, index: i, file: arr[i].file })
    };
    setPreviewSrc(newArr);
    setMainPreview(newArr[0]);
  };

  function extractFiles() {
    let arr = [];
    for (let i=0; i<previewSrc?.length; i++) {
      if (previewSrc[i].file) arr.push(previewSrc[i].file);
    };
    setFiles(arr);
    setStatus('start');
  };

  async function handleFilesChange(e) {
    if (status !== 'change') setStatus('change');

    const arr = Array.from(e.target.files);
    
    while (arr.length > 5 - previewSrc?.length) arr.pop();
    
    const arrData = [];
    const valid = ['image/jpeg', 'image/png'];
    
    try {
      for (let i=0; i<arr.length; i++) {
        const str = await fileToDataString(arr[i]);
        if (valid.includes(arr[i].type)) { arrData.push({ pic: str, index: i, file: arr[i] }) }
      };
      
      for (let i=0; i<previewSrc?.length; i++) { 
        arrData.push({ pic: previewSrc[i].pic, index: arrData.length, file: previewSrc[i].file }) 
      };
      
      setPreviewSrc(arrData);
      setTimeout(() => {setMainPreview(arrData[0])}, 1000);
      e.target.value = '';

    } catch (err) {
      console.log('PREVIEW ERROR - ', err);
    }
  };

  const resetStatus = useEffectEvent(()=>{
    setStatus('idle');
    setPreviewSrc(null);
  });

  const handleAlbumUpload = useEffectEvent(async (files) => {
    setStatus('uploading');
    SetShowUploadAnimation(true);
    setHidden(false);

    const valid = ['image/jpeg', 'image/png'];

    if (files.length) {
      for (let i=0; i<files.length; i++) {
        if (!valid.includes(files[i].type)) {
          console.log('INVALID FILE EXTENSION');
          setFiles(null);
          setStatus('idle');
          return;
        }
      };
    };

    const untouched = [];
    
    for (let i=0; i<previewSrc?.length; i++) {
      if (previewSrc[i].file === null) untouched.push(previewSrc[i].pic);
    };

    const formData = new FormData();
    for (let i=0; i<files.length; i++) {
      formData.append('album', files[i]);
    };

    try {
      const response = await axiosPrivate.post('/album_upload', formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          withCredentials: true,
          params: {postreg: true, untouched: JSON.stringify(untouched), toRemove: JSON.stringify(toRemove)}
        });      
      setStatus('success');
      setAuth({...auth, album: response.data});
      setToRemove([]);

    } catch(err) {
      setFiles(null);
      setStatus('change');
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else if (err.response?.status === 422) {
        console.log('INVALID FILE EXTENSION');
      } else if (err.response?.status === 401) {
        console.log('UNAUTHORIZED');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    }
  });

  const delayEmpty = useEffectEvent((command, time)=>{setTimeout(() => {setEmpty(command)}, time)});
  
  useEffect(()=>{
    if (!previewSrc && status === 'idle') {InitializePreview()};
    if (status === 'start') handleAlbumUpload(files);
    if (status === 'success') resetStatus();
    if (previewSrc && !previewSrc.length) delayEmpty(true, 0);
    if (previewSrc && previewSrc.length) delayEmpty(false, 0);
  },[previewSrc, status, files]);
  
  return (
    <>
      <div className={`${styles.gallery_container}`}>

        <div className={`${styles.preview}`}>
          
          {empty && <div className={`${styles.empty}`}>
            Your gallery is empty
          </div>}
          
          
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
            <img src='../../img/right-arrow.png' alt='' />
          </div>}
            
        </div>
        
        <div className={`${styles.photos}`}>
          {
            previewSrc?.map(item => {
              return (
                <div className={`
                    ${styles.photos_wrapper}
                    ${!mainPreview ? styles.hidden : null}
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
                      <img key={item.index} src='../../img/trash.png' alt='' />
                    </div>
                  }

                  {item?.pic?.includes('cloudinary') &&
                    <Thumb key={item.index} src={item?.pic} alt={'Main Preview'}/>
                  }

                  {!item?.pic?.includes('cloudinary') &&
                    <img key={item.index} src={item?.pic} alt={'Main Preview'}/>
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