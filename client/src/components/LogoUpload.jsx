import { useState, useEffect, useEffectEvent } from 'react'
import useAuth from '../hooks/useAuth'
import styles from '../styles/LogoUpload.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const LogoUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  function handleFileChange(e) {
    if (e.target.files) {
      setFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleFileUpload = useEffectEvent(async (file) => {

    const valid = ['image/jpeg', 'image/png'];   

    if (!valid.includes(file.type)) {
      console.log('INVALID FILE EXTENSION');
      setFile(null);
      setStatus('idle');
      return;
    }
    
    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosPrivate.post('/logo_upload', formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          withCredentials: true,
        });
      setStatus('success');
      console.log('LOGO UPLOADED');      
      setAuth({...auth, avatar: response.data});
      
    } catch(err) {
      setFile(null);
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
      if (auth.stage === '0') setAuth({...auth, stage: '1'});
      setFile(null);
      setStatus('idle');
    }    
  });
  
  useEffect(()=>{    
    if (file && status === 'idle') handleFileUpload(file);
    resetStatus(status);
  },[file, status]);
  return (
    <>
    <div className={`${styles.container}`}>
      <input className={`${styles.upload}`} type='file' id='file' name='file' onChange={handleFileChange}/>
      <label htmlFor='file' className={`${styles.label}`}>
      <img src='../../img/add.png'
         alt='ADD'
         className={`${auth.avatar ? styles.hidden : null} ${styles.add}`}
      />
      <img src={auth.avatar} alt='LOGO' className={`${!auth.avatar ? styles.hidden : null} ${styles.logo}`}/>
      </label>
    </div>      
    </>
  )
}

export default LogoUpload