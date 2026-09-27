import styles from '../styles/AlbumUpload.module.css'
import { useState, useEffect, useEffectEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { AxiosError } from 'axios'
import fileToDataString from '../utils/fileToDataString'
import { PreviewSrcType } from '../types'

type AlbumUploadProps = { 
  albumUploadPending?: boolean, 
  setAlbumUploadPending?: React.Dispatch<React.SetStateAction<boolean>>, 
  postreg: boolean
}

const AlbumUpload = ({ albumUploadPending, setAlbumUploadPending, postreg }: AlbumUploadProps) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const [files, setFiles] = useState<File[] | null>(null);
  const [status, setStatus] = useState('idle');
  const [previewSrc, setPreviewSrc] = useState<PreviewSrcType[] | null>(null);
  const [mainPreview, setMainPreview] = useState<PreviewSrcType | null>(null);
  const getRandomKey = () => crypto.randomUUID();
  const navigate = useNavigate();

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {


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

      setPreviewSrc(arrData);
      setMainPreview(arrData[0])
      e.target.value = '';      

    } catch (err) {
      console.log('PREVIEW ERROR - ',err);
    }
  };

  function nextPic(item: PreviewSrcType | null) {
    if (!item || !previewSrc?.length) return;    
    if (previewSrc && item.index === previewSrc.length - 1) {
      setMainPreview(previewSrc[0]);
      return
    };
    setMainPreview(previewSrc![item.index+1]);
  };

  function prevPic(item: PreviewSrcType | null) {
    if (!item || !previewSrc?.length) return;
    if (previewSrc && item.index === 0) {
      setMainPreview(previewSrc[previewSrc.length - 1]);
      return
    };
    setMainPreview(previewSrc![item.index-1]);
  };

function removePic(item: PreviewSrcType) {
  if (!previewSrc) return;

  const itemIndex = previewSrc.indexOf(item);
  if (itemIndex === -1) return;

  const newArr = previewSrc
    .filter((_, index) => index !== itemIndex)
    .map((preview, index) => ({ ...preview, index }));

  setPreviewSrc(newArr.length ? newArr : null);
  setMainPreview(newArr[0] ?? null);
}

const extractFiles = () => {
  if (!previewSrc) return;

  const extractedFiles = previewSrc
  .map((preview) => preview.file)
  .filter((file): file is File => file !== null);

  setFiles(extractedFiles);
  setPreviewSrc(null);
};

  const handleAlbumUpload = useEffectEvent(async (files: File[]) => {

    const valid = ['image/jpeg', 'image/png'];

    for (let i=0; i<files.length; i++) {
      if (!valid.includes(files[i].type)) {
        console.log('INVALID FILE EXTENSION');
        setFiles(null);
        setStatus('idle');
        return;
      }
    };
    
    setStatus('uploading');
    const formData = new FormData();
    for (let i=0; i<files.length; i++) {
      formData.append('album', files[i]);
    };

    try {
      const response = await axiosPrivate.post('/album_upload', formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          withCredentials: true,
          params: {postreg: postreg, untouched: null}
        });
      setStatus('success');
      console.log('ALBUM UPLOADED -', response.data);
      if (auth && auth.stage === '1' && !postreg) setAuth({...auth, stage: '2', album: response.data});
      if (albumUploadPending) {
        setAlbumUploadPending?.(false);
        navigate(0);
      };

    } catch(err) {
      setFiles(null);
      setStatus('idle');
      const axiosError = err as AxiosError; 
      if (!axiosError?.response) {
        console.log('NO SERVER RESPONSE');
      } else if (axiosError.response?.status === 422) {
        console.log('INVALID FILE EXTENSION');
      } else if (axiosError.response?.status === 401) {
        console.log('UNAUTHORIZED');
      } else if (axiosError.response?.status === 413) {
        console.log('ONE OR MORE FILES ARE TOO LARGE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    }
    
  });

  const resetStatus = useEffectEvent((status: string)=>{
    if(status === 'success') {
      setFiles(null);
      setStatus('idle');
    }    
  });

  useEffect(()=>{
    if (files && status === 'idle') {
      handleAlbumUpload(files);
      resetStatus(status);
    };
  },[files, status, previewSrc]);

  return (
    <>
    {status === 'idle'
    ?  
      <div className={`${styles.stage2}`}>      
        <div className={`${styles.welcome} ${previewSrc ? styles.hidden : null}`}>{
          auth?.roles[0] === 'venue'
          ?
          <div className={`${styles.venue}`}>
               {`Now, upload some photos of your venue's interiors!`}<br /><br />
               {`We also recommend you to add a few images`}<br />
               {`of your fanciest dishes and cocktails.`}<br /><br />
            <label htmlFor='album' className={`${styles.label} ${previewSrc ? styles.hidden : null}`}>
              Upload
              <input
                className={`${styles.upload}`}
                multiple
                type='file'
                id='album'
                name='album'
                onChange={handleFilesChange}/>
            </label>
          </div>
          :
          <div className={`${styles.customer}`}>
            {`You can now upload more photos of yourself`} <br /> {`to your album!`}<br />
            <label htmlFor='album' className={`${styles.label} ${previewSrc ? styles.hidden : null}`}>
              Upload
              <input
                className={`${styles.upload}`}
                multiple
                type='file'
                id='album'
                name='album'
                onChange={handleFilesChange}/>
            </label>
            <button 
              onClick={()=> {
                if (auth && !postreg) setAuth({...auth, stage: '2'})
                if (albumUploadPending) setAlbumUploadPending?.(false);
              }}>Maybe Later</button>
          </div>
        }</div>

        <div className={`${styles.preview} ${previewSrc ? null : styles.hidden}`}>
          <div className={`${styles.album}`}>          
            <div className={`${styles.preview_section}`}>
              <div className={`${styles.previous}`} onClick={() => prevPic(mainPreview)}>
                <img src='../../img/right-arrow.png' alt='PREV' />
              </div>
              <div className={`${styles.preview_image}`}>
                <img src={mainPreview?.pic ?? ''} alt='IMG'/>
                <div className={`${styles.trash}`} onClick={() => {if (mainPreview) removePic(mainPreview)}}>
                  <img src='../../img/trash.png' alt='[X]'/>
                </div>
              </div>
              <div className={`${styles.next}`} onClick={() => nextPic(mainPreview)}>
                <img src='../../img/right-arrow.png' alt='NEXT' />
              </div>          
            </div>
            
            <ul>{previewSrc?.map((item) => (
              <div key={getRandomKey()}
                   className={`${styles.item} ${mainPreview === item ? styles.focused : null}`}>
                  <img src={item.pic} alt='IMG' onClick={() => setMainPreview(item)}/>
              </div>
              ))}
            </ul>

            <div className={`${styles.btns}`}>
              <button onClick={()=> {extractFiles()}}>Upload</button>
              <button onClick={()=> {setPreviewSrc(null)}}>Cancel</button>
            </div>          
          </div>
        </div>      
      </div>
    :
    <div className={`${styles.loading}`}>
      <img src='../../img/loading.gif' alt='PLEASE WAIT' />
      <br />
      <div>LOADING...</div>
    </div>
    }  
    </>
  );
};

export default AlbumUpload