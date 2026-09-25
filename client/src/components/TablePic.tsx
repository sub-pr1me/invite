import styles from '../styles/TablePic.module.css'
import { useState, useEffect, useEffectEvent, ChangeEvent } from 'react'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { AxiosError } from 'axios'

type TablePicProps = { 
  setCustomize: React.Dispatch<React.SetStateAction<number | null>>;
  customize: number;
}

const TablePic = ({ setCustomize, customize }: TablePicProps) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth} = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('idle');

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file: File | undefined = e.target.files?.[0];
    if (!file) {return} else {
      setFile(file);
      e.target.value = '';
    };    
  };

  const handleFileUpload = useEffectEvent(async (file: File) => {

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
      
      if (!auth) {throw new Error('Missing auth context')};

      const tables = auth.tables ?? [];
      setAuth({...auth,
        tables: tables.map(table => {
          if (table.id === customize) {
            return {...table, pic: response.data};
          } else {
            return table;
          };
        })
      });

    } catch(err: unknown) {      
      setFile(null);
      setStatus('idle');
      const axiosError = err as AxiosError;      
      if (!axiosError?.response) {
        console.log('NO SERVER RESPONSE');
      } else if (axiosError.response?.status === 422) {
        console.log('INVALID FILE EXTENSION');
      } else if (axiosError.response?.status === 401) {
        console.log('UNAUTHORIZED');
      } else if (axiosError.response?.status === 413) {
        console.log('FILE IS TOO LARGE');
      } else {
        console.log('SOMETHING WENT WRONG', axiosError.response.status);
      }
    }
  });

  const resetStatus = useEffectEvent((status: string)=>{
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
      {status === 'success' && auth?.tables?.[customize-1].pic
      &&
      <div className={`${styles.uploaded_image} ${file || !auth?.tables[customize-1].pic ? styles.hidden : null}`}>
        <img src={auth?.tables[customize-1].pic && !file ? auth?.tables[customize-1].pic : undefined} alt='' />
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
            auth?.tables?.[customize-1].pic
            ?
            <img src={auth?.tables[customize-1].pic} alt='' />
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
            {auth?.tables?.[customize-1].pic ? 'Change' : 'Upload'}
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