import styles from '../styles/TablePic.module.css'
import { useState, useEffect, useEffectEvent } from 'react'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import fileToDataString from '../utils/fileToDataString'

const TablePic = ({ setCostumize, customize }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const [files, setFiles] = useState(null);
  const [status, setStatus] = useState('idle');
  const [previewSrc, setPreviewSrc] = useState(null);

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
      e.target.value = '';
    } catch (err) {
      console.log('PREVIEW ERROR - ',err);
    }
  };

  const handleAlbumUpload = useEffectEvent(async (files) => {

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
        });
      setStatus('success');
      console.log('ALBUM UPLOADED -', response.data);
      if (auth.stage === '1') setAuth({...auth, stage: '2'});

    } catch(err) {
      setFiles(null);
      setStatus('idle');
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

  const resetStatus = useEffectEvent((status)=>{
    if(status === 'success') {
      setFiles(null);
      setStatus('idle');
    }    
  });

  useEffect(()=>{
    if (files && status === 'idle') {
      handleAlbumUpload(files);
      resetStatus(status);
    }    
  },[files, status]);

  return (
    <>
      <div className={`${styles.upload_container}`}>
        <div className={`${styles.cust_name}`}><strong>Table {`${customize}`}</strong></div>
        <div className={`${styles.message}`}>
          Upload a photo of this table <br /> 
          to make it more appealing for customers!
        </div>
        <div className={`${styles.btns}`}>
          <button onClick={()=> {setCostumize(null)}}>Cancel</button>
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
      </div>
      
    </>
  );
};

export default TablePic