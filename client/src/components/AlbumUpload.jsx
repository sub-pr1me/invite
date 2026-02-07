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

  function nextPic(item) {
    if (item[2] === previewSrc.length - 1) {
      setMainPreview(previewSrc[0]);
      return
    };
    setMainPreview(previewSrc[item[2]+1]);
  };

  function prevPic(item) {
    if (item[2] === 0) {
      setMainPreview(previewSrc[previewSrc.length - 1]);
      return
    };
    setMainPreview(previewSrc[item[2]-1]);
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
    const newArr = [];
    for (let i=0; i<arr.length; i++) {
      newArr.push([arr[i][0], arr[i][1], i])
    };
    setPreviewSrc(newArr);
    setMainPreview(newArr[0]);
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
            <div className={`${styles.previous}`} onClick={() => prevPic(mainPreview)}>
              <img src='../../img/right-arrow.png' alt='PREV' />
            </div>
            <div className={`${styles.preview_image}`}>
              <img src={previewSrc && mainPreview[1]} alt='IMG'/>
              <div className={`${styles.trash}`} onClick={() => removePic(mainPreview)}>
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
                <img src={item[1]} alt='IMG' onClick={() => setMainPreview(item)}/>
            </div>
            ))}
          </ul>
          <div className={`${styles.btns}`}>
            <button>Upload</button>
            <button onClick={()=> {setPreviewSrc(null)}}>Cancel</button>
          </div>          
        </div>
      </div>      
    </div>
    </>
  )
}

export default AlbumUpload