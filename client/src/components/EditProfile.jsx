import styles from '../styles/EditProfile.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useState, useRef, useEffect } from 'react'
import ChooseOpenHours from './ChooseOpenHours'

const EditProfile = ({ title, state, setState, btn, variable, type }) => {

  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [inputValue, setInputValue] = useState(null);
  const inputRef = useRef();

  const EditProfileInfo = async () => {

    try {
      const response = await axiosPrivate.post('/info_edit',
        {name: inputValue, email: inputValue, acc_type: auth.roles[0]},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );

      const update = response.data;

      if (variable === 'name') {
        if (auth.roles[0] === 'venue') {
          setAuth({...auth, name: inputValue, dates: update.dates});
        } else { setAuth({...auth, name: inputValue}) }
      };

      console.log(update.message);

      // if (variable === 'email') setAuth({...auth, email: inputValue});
      setInputValue(null);
      setState(null);

    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    }
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
          onChange={(e)=> setInputValue(e.target.value)}
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
          <button onClick={()=>{EditProfileInfo()}}>
            {btn ? btn : 'Submit'}
          </button>
        </div>
        }
      </div>
    </>
  );
};

export default EditProfile