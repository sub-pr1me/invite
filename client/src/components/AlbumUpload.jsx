import styles from '../styles/AlbumUpload.module.css'
import { useState, useEffect, useEffectEvent } from 'react'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import fileToDataString from '../utils/fileToDataString'

const AlbumUpload = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const [files, setFiles] = useState(null);
  const [status, setStatus] = useState('idle');
  const [previewSrc, setPreviewSrc] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);

  async function handleFilesChange(e) {
    const arr = Array.from(e.target.files);    
    while (arr.length > 5) arr.pop();
    const cutArr = [];
    const valid = ['image/jpeg', 'image/png'];
    try {
      for (let i=0; i<arr.length; i++) {
        if (valid.includes(arr[i].type)) cutArr.push(await fileToDataString(arr[i]));
      }
      setPreviewSrc(cutArr);
      setMainPreview(cutArr[0])
      e.target.value = '';      

    } catch (err) {
      console.log('PREVIEW ERROR - ',err);
    }
  };

  // const handleAlbumUpload = useEffectEvent(async (files) => {

  //   const valid = ['image/jpeg', 'image/png'];

  //   for (let i=0; i<files.length; i++) {
  //     if (!valid.includes(files[i].type)) {
  //       console.log('INVALID FILE EXTENSION');
  //       setFiles(null);
  //       setStatus('idle');
  //       return;
  //     }
  //   };
    
  //   setStatus('uploading');
  //   const formData = new FormData();
  //   for (let i=0; i<files.length; i++) {
  //     formData.append('album', files[i]);
  //   };

  //   try {
  //     const response = await axiosPrivate.post('/album_upload', formData,
  //       {
  //         headers: {'Content-Type': 'multipart/form-data'},
  //         withCredentials: true,
  //       });
  //     setStatus('success');
  //     console.log('FILE UPLOADED');
  //     setAuth({...auth, album: response.data});

  //   } catch(err) {
  //     setFiles(null);
  //     setStatus('idle');
  //     if (!err?.response) {
  //       console.log('NO SERVER RESPONSE');
  //     } else if (err.response?.status === 422) {
  //       console.log('INVALID FILE EXTENSION');
  //     } else if (err.response?.status === 401) {
  //       console.log('UNAUTHORIZED');
  //     } else {
  //       console.log('SOMETHING WENT WRONG');
  //     }
  //   }
  // });

  // const resetStatus = useEffectEvent((status)=>{
  //   if(status === 'success') {
  //     setFiles(null);
  //     setStatus('idle');
  //   }    
  // });

  // useEffect(()=>{
  //   if (files && status === 'idle') {
  //     handleAlbumUpload(files);
  //     resetStatus(status);
  //     console.log('FILES - ', files);
  //   }    
  // },[files, status]);

  // console.log('RENDER');
  const getRandomKey = () => crypto.randomUUID();

  return (
    <>
    <div className={`${styles.stage2}`}>      
      <div className={`${styles.welcome} ${previewSrc ? styles.hidden : null}`}>{
        auth.roles[0] === 'venue'
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
          <button>Maybe Later</button>
        </div>
      }</div>
      <div className={`${styles.preview} ${previewSrc ? null : styles.hidden}`}>        
        <div className={`${styles.album}`}>          
          <div className={`${styles.preview_section}`}>
            <div className={`${styles.previous}`}>
              <img src='../../img/right-arrow.png' alt='PREV' />
            </div>
            <div className={`${styles.preview_image}`}>
              <img src={previewSrc ? mainPreview : '/'} alt='IMG'/>              
              <div className={`${styles.trash}`}>
                <img src='../../img/trash.png' alt='[X]'/>
              </div>
            </div>
            <div className={`${styles.next}`}>
              <img src='../../img/right-arrow.png' alt='NEXT' />
            </div>          
          </div>          
          <ul>{previewSrc?.map((item) => (
            <div key={getRandomKey()} className={`${styles.item}`}>
                <img src={item} alt='IMG' onClick={() => setMainPreview(item)}/>
            </div>
            ))}
          </ul>          
          <button onClick={()=> {setPreviewSrc(null)}}>Cancel</button>       
        </div>
      </div>      
    </div>
    </>
  )
}

export default AlbumUpload