import styles from '../styles/Log_In.module.css'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useEffectEvent } from 'react'
import axios from "../services/axios"
import useAuth from '../hooks/useAuth'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AxiosError } from 'axios'

const Log_In = () => {  
  
  const { setAuth, setActiveEmail } = useAuth();
  const navigate = useNavigate();

  const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const PASSWORD_REGEX = /^.{4,}$/;

  const [email, setEmail] = useState<string | null>(null);
  const [validEmail, setValidEmail] = useState<boolean>(false);  
  const [pwd, setPwd] = useState<string | null>(null);
  const [validPwd, setValidPwd] = useState<boolean>(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    emailRef.current?.focus();
  },[]);

  const validateEmail = useEffectEvent((email: string)=>{
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  });

  useEffect(()=>{
    if (email !== null) validateEmail(email);
  },[email]);

  const validatePwd = useEffectEvent((pwd: string)=>{
    const result = PASSWORD_REGEX.test(pwd);
    setValidPwd(result);
  });
  
  useEffect(()=>{
    if (pwd !== null) validatePwd(pwd);
  },[pwd]);

  async function LogIn(formData: FormData) {

    setEmail(null);
    setPwd(null);

    const emailValue = formData.get('email');
    const pwdValue = formData.get('password');

    const email = typeof emailValue === 'string' ? emailValue : '';
    const password = typeof pwdValue === 'string' ? pwdValue : '';    
    
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PASSWORD_REGEX.test(password);

    if (!v1 || !v2) {
      console.log(`Your hacking skills are worse than my alcoholism.`);
      return;
    };
    
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
      const id = response?.data?.id;
      const name = response?.data?.name;
      const stage = response?.data?.stage;
      const avatar = response?.data?.avatar;
      const album = response?.data?.album;
      const rating = response?.data?.rating;
      const hours = response?.data?.hours;
      const tables = response?.data?.tables;
      const likes = response?.data?.likes;
      const dob = response?.data?.dob;
      const gender = response?.data?.gender;
      const interest = response?.data?.interest;
      const dates = response?.data?.dates;
      const credits = parseInt(response?.data?.credits);

      if (accType === 'venue') setAuth({ 
        token: accessToken, id, roles: [accType], email, name, stage, avatar, album, likes, rating, hours, tables, dates, credits
      });

      if (accType === 'customer') setAuth({ 
        token: accessToken, id, roles: [accType], email, name, stage, avatar, album, likes, dob, gender, interest, dates, credits
      });

      console.log('LOGGED IN');
      navigate('/dashboard');
      
    } catch (err) {
      const axiosError = err as AxiosError;
      if (!axiosError?.response) {
        console.log('NO SERVER RESPONSE');
      } else if (axiosError.response?.status === 400) {
        console.log(axiosError.response.data);
      } else if (axiosError.response?.status === 401) {
        console.log('UNAUTHORIZED - ', axiosError.response.data);
      } else {
        console.log('LOGIN FAILED');
      }
    };
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