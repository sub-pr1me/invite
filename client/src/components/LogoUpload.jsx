import { useState, useEffect, useEffectEvent } from 'react'
import useAuth from '../hooks/useAuth'
import styles from '../styles/LogoUpload.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const LogoUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  function handleFileChange(e) {if (e.target.files) setFile(e.target.files[0])};

  const handleFileUpload = useEffectEvent(async (file) => {
    setStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axiosPrivate.post('/logo_upload', formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          withCredentials: true,
        });
      setStatus('success');
      console.log('FILE UPLOADED');
    } catch(err) {
      setStatus('error');
      console.log(err);
    }
  });

  const resetStatus = useEffectEvent((status)=>{
    if(status === 'success') {
      setFile(null);
      setAuth({...auth, stage: '1'});
      window.location.reload();
    }    
  });
  
  useEffect(()=>{    
    if (file && status === 'idle') handleFileUpload(file);
    resetStatus(status);
  },[file, status]);

  return (
    <>
      <input className={`${styles.upload}`} type='file' id='file' name='file' onChange={handleFileChange}/>
      <label htmlFor='file'>
        <img src='../../img/add.png'
           alt='ADD'
           className={`${auth.avatar ? styles.hidden : null} ${styles.add}`}/>
      </label>
    </>
  )
}

export default LogoUpload