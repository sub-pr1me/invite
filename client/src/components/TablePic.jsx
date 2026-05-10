import styles from '../styles/TablePic.module.css'
import { useState, useEffect, useEffectEvent } from 'react'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const TablePic = ({ setCustomize, customize }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');

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
    formData.append('tablepic', file);    

    try {
      const response = await axiosPrivate.post('/table_upload', formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          withCredentials: true,
          params: {id: customize}
        });
      setStatus('success');
      console.log(`TABLE-${customize} PHOTO UPLOADED`);
      setAuth({...auth,
        tables: auth.tables.map(table => {
          if (table.id === customize) {
            return {...table, pic: response.data};
          } else {
            return table;
          };
        })
      });

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
      setFile(null);
    }    
  });
  
  useEffect(()=>{
    if (file && status === 'idle') handleFileUpload(file);
    resetStatus(status);
  },[file, status]);

  return (
    <>
      {file
      &&
      <div className={`${styles.loading}`}>
        <img src='../../img/load.gif' alt='' />
        <br />
        <div>LOADING...</div>
      </div>
      }
      {status === 'success' && auth.tables[customize-1].pic
      &&
      <div className={`${styles.uploaded_image} ${file || !auth.tables[customize-1].pic ? styles.hidden : null}`}>
        <img src={auth.tables[customize-1].pic && !file ? auth.tables[customize-1].pic : null} alt='' />
        <div>
          Image uploaded!
        </div>
          <button onClick={()=>{
            setStatus('idle');
            setFile(null);
            setCustomize(null);            
            }}>
            OK
          </button>
      </div>
      }
      {status === 'idle' &&
      <div className={`${styles.upload_container}`}>
        <div className={`${styles.cust_name}`}><strong>Table {`${customize}`}</strong></div>
        <div className={`${styles.message}`}>
          {
            auth.tables[customize-1].pic
            ?
            <img src={auth.tables[customize-1].pic} alt='' />
            :
            <div>
              Upload a photo of this table <br /> 
              to make it more appealing for customers!
          </div>
          }
        </div>
        <div className={`${styles.btns}`}>
          <button onClick={()=> {setCustomize(null)}}>Cancel</button>
          <label htmlFor='tablepic' className={`${styles.label}`}>
            {auth.tables[customize-1].pic ? 'Change' : 'Upload'}
            <input
              className={`${styles.upload}`}
              multiple
              type='file'
              id='tablepic'
              name='tablepic'
              onChange={handleFileChange}/>
          </label>          
        </div>
      </div>
      }
    </>
  );
};

export default TablePic