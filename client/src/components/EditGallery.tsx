import styles from '../styles/EditGallery.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useEffectEvent, useState } from 'react'
import fileToDataString from '../utils/fileToDataString'
import Image from './Image';
import Thumb from './Thumb';
import { PreviewSrcType } from '../types'
import { AxiosError } from 'axios'

type EditGalleryProps = { 
  previewSrc: PreviewSrcType[] | null, 
  setPreviewSrc: React.Dispatch<React.SetStateAction<PreviewSrcType[] | null>>, 
  SetShowUploadAnimation: React.Dispatch<React.SetStateAction<boolean>>, 
  setHidden: React.Dispatch<React.SetStateAction<boolean>>
}

const EditGallery = ({ previewSrc, setPreviewSrc, SetShowUploadAnimation, setHidden }: EditGalleryProps) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth} = useAuth();
  const [status, setStatus] = useState('idle');
  const [files, setFiles] = useState<(File | null)[] | null>(null);
  const [mainPreview, setMainPreview] = useState<PreviewSrcType | null>(null);
  const [empty, setEmpty] = useState(false);
  const [toRemove, setToRemove] = useState<string[]>([]);

  
  const InitializePreview = useEffectEvent(()=>{
    if (!auth) {throw new Error('Missing auth context')};
    setTimeout(() => { SetShowUploadAnimation(false) }, 2500);
    const arr = [];    
    for (let i=0; i<auth.album?.length; i++) {
      arr.push({ pic: auth.album[i], index: i, file: null });
    };
    setPreviewSrc(arr);
    setMainPreview(arr[0]);
    setStatus('idle');
    setEmpty(false);
  });

  function removePic(item: PreviewSrcType | null) {
    if (!item) return;
    setStatus('change');
    const arr = previewSrc;

    if (arr?.length === 1) {
      setToRemove([...toRemove, arr[0].pic]);
      setPreviewSrc(null);
      setMainPreview(null);
      setEmpty(true);
      return;
    };

    const existing = [];
    for (const element of auth?.album!) {
      const arr = element.split('/');
      const arr2 = arr[arr?.length - 1].split('.');
      const imgID = arr2[arr2.length -2];
      existing.push(imgID)
    };

    if (!previewSrc) return;

    const index = previewSrc.indexOf(item);
    const removed = arr?.splice(index, 1);

    const arrX = removed![0].pic.split('/');
    const arrY = arrX[arrX.length - 1].split('.');
    const removedID = arrY[arrY.length -2];

    if (existing.includes(removedID)) setToRemove([...toRemove, removed![0].pic]);

    const newArr = previewSrc.map((preview, index) => ({...preview, index}));
    setPreviewSrc(newArr);
    setMainPreview(newArr[0]);
  };

  function extractFiles() {
    let arr = [];
    const previews = previewSrc ?? [];
    for (let i=0; i<previews?.length; i++) {
      if (previewSrc?.[i].file) arr.push(previewSrc[i].file);
    };
    setFiles(arr);
    setStatus('start');
  };

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (status !== 'change') setStatus('change');

    const arr: File[] = Array.from(e.target.files ?? []);    
    const prev = previewSrc ?? [];
    while (arr?.length > 5 - prev?.length) arr.pop();    
    const arrData: PreviewSrcType[] = [];
    const valid = ['image/jpeg', 'image/png'];
    
    try {
      for (let i=0; i<arr?.length; i++) {
        const str = await fileToDataString(arr[i]);
        if (valid.includes(arr[i].type) && typeof str === 'string') { 
          arrData.push({ pic: str, index: i, file: arr[i] })
        };
      };
      
      const previews = previewSrc ?? [];
      for (let i=0; i<previews?.length; i++) { 
        arrData.push({ pic: previews[i].pic, index: arrData.length, file: previews[i].file }) 
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

  const handleAlbumUpload = useEffectEvent(async (files: File[]) => {
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
    const previews = previewSrc ?? [];
    const untouched = [];
    
    for (let i=0; i<previews?.length; i++) {
      if (previews[i].file === null) untouched.push(previews[i].pic);
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
      if (!auth) {throw new Error('Missing auth context')};
      setAuth({...auth, album: response.data});
      setToRemove([]);

    } catch (err) {      
      const axiosError = err as AxiosError;      
      if (!axiosError?.response) {
        console.log('NO SERVER RESPONSE');
      } else if (axiosError.response?.status === 422) {
        console.log('INVALID FILE EXTENSION');
      } else if (axiosError.response?.status === 401) {
        console.log('UNAUTHORIZED');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    }
  });

  const delayEmpty = useEffectEvent((command: boolean, time: number)=>{setTimeout(() => {setEmpty(command)}, time)});
  
  useEffect(()=>{
    if (!previewSrc && status === 'idle') {InitializePreview()};
    if (status === 'start') handleAlbumUpload((files ?? []).filter((file): file is File => file !== null));
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
              const previews = previewSrc ?? [];
              const index = previewSrc?.indexOf(mainPreview);

              if (index === undefined || previews.length === 0) return;

              if (index > 0) {
                setMainPreview(previews[index - 1]);
              } else {
                setMainPreview(previews[previews?.length - 1]);
              }
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
              const previews = previewSrc ?? [];
              const index = previewSrc?.indexOf(mainPreview);
              if (index === undefined || previews.length === 0) return;
              if (index < previews?.length - 1) {setMainPreview(previews[index + 1])
              } else {setMainPreview(previews[0])}
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
                      <img key={item.index+'x'} src='../../img/trash.png' alt='' />
                    </div>
                  }

                  {item?.pic?.includes('cloudinary') &&
                    <Thumb key={item.index+'y'} src={item?.pic} alt={'Main Preview'}/>
                  }

                  {!item?.pic?.includes('cloudinary') &&
                    <img key={item.index+'z'} src={item?.pic} alt={'Main Preview'}/>
                  }

                </div>
              )
            })
          }
        </div>
        <div className={`${styles.buttons}`}>

          {previewSrc && previewSrc?.length > 4 &&
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
              Upload Photos
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