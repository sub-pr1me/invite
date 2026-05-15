import styles from '../styles/EditProfile.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChooseOpenHours from './ChooseOpenHours'

const EditProfile = ({ title, state, setState, variable, type }) => {

  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [nameValue, setNameValue] = useState(null);
  const [emailValue, setEmailValue] = useState(null);
  const inputRef = useRef();
  const navigate = useNavigate();

  const EditProfileInfo = async () => {

    try {
      const response = await axiosPrivate.post('/info_edit',
        {old_email: auth.email, new_name: nameValue, new_email: emailValue, acc_type: auth.roles[0]},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );

      const update = response.data;

      if (variable === 'name') {
        if (auth.roles[0] === 'venue') {
          setAuth({...auth, name: update.name, dates: update.dates});
        } else { setAuth({...auth, name: update.name}) }
      };

      if (variable === 'email') {
        if (auth.roles[0] === 'venue') {
          setAuth({...auth, email: update.email, dates: update.dates});
        } else { setAuth({...auth, email: update.email}) }
      };

      console.log(update.message);

      setNameValue(null);
      setEmailValue(null);
      setState(null);

    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    };
  };

  const DeleteAccount = async () => {
    console.log('DELETE ACCOUNT');

    const links = [];
    links.push(auth.avatar);
    
    if (auth.album?.length) {
      const album = auth.album;
      for (let item of album) links.push(item);
    };

    if (auth.roles[0] === 'venue') {
      const tables = auth.tables.filter(item => item.pic);
      for (let i=0; i<tables.length; i++) {
        links.push(tables[i].pic);
      };
    };

    const picsToRemove = [];
    for (let str of links) {
      const arr = str.split('/');
      const arr2 = arr[arr.length - 1].split('.');
      const imgID = arr2[arr2.length -2];
      picsToRemove.push(imgID)
    };

    try {
      const response = await axiosPrivate.post('/delete_account',
        {email: auth.email, acc_type: auth.roles[0], picsToRemove: picsToRemove},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );

      await axiosPrivate.post('/auctions_update',
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );

      console.log(response.data);
      setState(null);
      navigate('/');

    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    };
  };

  useEffect(()=>{
    inputRef?.current?.focus();
  },[]);

  return (
    <>
      <div className={`${styles.edit_container}`}>
        <div className={`${styles.title}`}>{title}</div>

        {variable !== 'hours' && variable !== 'delete' &&
          <input 
          required
          name={variable}
          id={variable}
          type={type}
          ref={inputRef}
          autoComplete='off'
          onChange={(e)=> {
            if (variable === 'name') setNameValue(e.target.value);
            if (variable === 'email') setEmailValue(e.target.value);
          }}
        />
        }

        {variable !== 'hours' && variable !== 'delete' &&
        <label htmlFor={variable}></label>
        }

        {variable === 'hours' &&
          <ChooseOpenHours 
            state={state}
            setState={setState}
          />
        }

        {variable !== 'hours' &&
        <div className={`${styles.btns_container}`}>
          <button onClick={()=>{setState(!state)}}>
            Cancel
          </button>
          <button onClick={()=>{
            if (variable !== 'delete') EditProfileInfo();
            if (variable === 'delete') DeleteAccount();
          }}>
            {variable === 'delete' ? 'Delete' : 'Submit'}
          </button>
        </div>
        }
      </div>
    </>
  );
};

export default EditProfile