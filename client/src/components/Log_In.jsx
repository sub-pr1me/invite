import styles from '../styles/Log_In.module.css'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useEffectEvent } from 'react'
import axios from "../api/axios"
import useAuth from '../hooks/useAuth'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Log_In = () => {
  
  const { setAuth, setActiveEmail } = useAuth();
  const navigate = useNavigate();

  const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const PASSWORD_REGEX = /^.{4,}$/;

  const [email, setEmail] = useState(false);
  const [validEmail, setValidEmail] = useState(false);  
  const [pwd, setPwd] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const emailRef = useRef();

  useEffect(()=>{
    emailRef.current.focus();
  },[]);

  const validateEmail = useEffectEvent((email)=>{
    const result = EMAIL_REGEX.test(email);
    // console.log(result);
    // console.log(email);
    setValidEmail(result);
  })
  useEffect(()=>{
    validateEmail(email);
  },[email]);

  const validatePwd = useEffectEvent((pwd)=>{
    const result = PASSWORD_REGEX.test(pwd);
    // console.log(result);
    // console.log(pwd);
    setValidPwd(result);
  })
  useEffect(()=>{
    validatePwd(pwd);
  },[pwd]);

  async function LogIn(formData) {

    const v1 = PASSWORD_REGEX.test(pwd);
    const v2 = EMAIL_REGEX.test(email);
    if (!v1 || !v2) {
      console.log('Invalid Entry Attempt!');
      return;
    }

    const email = formData.get('email');
    const password = formData.get('password');

    try {      
      const response = await axios.post("/login",
        {email: email, password: password},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );

      const accessToken = response?.data?.accessToken;
      const accType = response?.data?.accType;
      const name = response?.data?.name;
      const stage = response?.data?.stage;
      const avatar = response?.data?.avatar;
      const album = response?.data?.album;
      const rating = response?.data?.rating;

      setAuth({ token: accessToken, roles: [accType], email, name, stage, avatar, album, rating });
      console.log('LOGGED IN');
      navigate('/dashboard');
      
    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else if (err.response?.status === 400) {
        console.log('MISSING EMAIL OR PASSWORD');
      } else if (err.response?.status === 401) {
        console.log('UNAUTHORIZED');
      } else {
        console.log('LOGIN FAILED');
      }
    }
  };
  
  return (
    <div className={`${styles.container}`}>
      <h2>Log In:</h2>
      <form action={LogIn}>
        <div className={styles.field}>
              <input 
                required
                name='email'
                id='email'
                type='email' 
                placeholder='Email'
                ref={emailRef}
                autoComplete='off'
                onChange={(e)=> setEmail(e.target.value)}
                aria-invalid={validEmail ? 'false' : 'true'}
              />
              <label htmlFor="email" className={`${!email ? styles.hidden : null}`}>
                <span className={`${validEmail ? 'valid' : styles.hidden} ${styles.check}`}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={`${validEmail || !email ? styles.hidden : 'invalid'}
                  ${styles.x}`}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
            </div>
            <div className={styles.field}>
              <input 
                required
                name='password'
                id='password'
                type='password' 
                placeholder='Password'
                onChange={(e)=> setPwd(e.target.value)}
                aria-invalid={validPwd ? 'false' : 'true'}
                aria-describedby='pwdnote'
              />
              <label htmlFor="password" className={`${!pwd ? styles.hidden : null}`}>
                <span className={`${validPwd ? 'valid' : styles.hidden} ${styles.check}`}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={`${validPwd || !pwd ? styles.hidden : 'invalid'}
                  ${styles.x}`}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
            </div>
            <button disabled={!validEmail || !validPwd ? true : false}
            >Submit</button>
      </form>
        <button
            onClick={() => {
              setActiveEmail(null);
              navigate('/');
            }}>Go Back
        </button>   
    </div>
  )
}

export default Log_In