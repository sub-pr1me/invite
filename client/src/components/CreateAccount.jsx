import styles from '../styles/CreateAccount.module.css'
import { useState, useEffect, useRef, useEffectEvent } from 'react'
import axios from '../api/axios'
import AccTypeChoice from './AccTypeChoice'
import { useNavigate } from 'react-router-dom'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PASSWORD_REGEX = /^.{4,}$/;

const CreateAccount = () => {
  const [result, setResult] = useState(null);
  const [accType, setAccType] = useState('venue');
  const navigate = useNavigate();

  const usernameRef = useRef();
  const errRef = useRef();
  
  const [username, setUsername] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);
  const [email, setEmail] = useState(false);
  const [validEmail, setValidEmail] = useState(false);  
  const [pwd, setPwd] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(()=>{
    usernameRef.current.focus();
  },[]);

  const validateName = useEffectEvent((username)=>{
    const result = NAME_REGEX.test(username);
    // console.log(result);
    // console.log(username);
    setValidUsername(result);
  })
  useEffect(()=>{
    validateName(username);
  },[username]);

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

  const errMSG = useEffectEvent(()=>{
    setErrMsg('');
  })
  useEffect(()=>{
    errMSG();
  },[username, email, pwd]);

  async function AddNewAcc(formData) {

    const v1 = NAME_REGEX.test(name);
    const v2 = PASSWORD_REGEX.test(pwd);
    const v3 = EMAIL_REGEX.test(email);
    if (!v1 || !v2 || !v3) {
      console.log('Invalid Entry Attempt!');
      return;
    }
    
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const acc_type = formData.get('acc_type');

    try {

    const response = await axios.post('/create_account',
      { acc_type: acc_type, name: name, email: email, password: password },
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    );

    if (response.data === 'duplicate') setResult('duplicate');
    if (response.data === 'success') setResult('success');

    setUsername(false);
    setEmail(false);
    setPwd(false);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=> {
    if (result === 'success') setTimeout(() => { navigate('/acc_created')}, 0);
  });

  if (result === 'success') setTimeout(() => { navigate('/login')}, 2000);

  return (
    <section className={`${styles.container}`}>
        <AccTypeChoice
          accType={accType}
          setAccType={setAccType}
        />
        <div className={`${styles.duplicate} ${result !== 'duplicate' ? styles.hidden : null}`}>
          {`This e-mail address is already taken!`}
        </div>
        <p ref={errRef} className={errMsg ? styles.errmsg :
        styles.offscreen} aria-live='assertive'>{errMsg}</p>
        <form action={AddNewAcc}>
            <div className={styles.field}>
              <input 
                required
                name='name'
                id='name'
                type='text' 
                placeholder={accType === 'venue' ? 'Venue Name' : 'Customer Name'}
                ref={usernameRef}
                autoComplete='off'
                onChange={(e)=> setUsername(e.target.value)}
                aria-invalid={validUsername ? 'false' : 'true'}
                aria-describedby='uidnote'
                onFocus={()=> setUsernameFocus(true)}
                onBlur={()=>setUsernameFocus(false)}
              />
              <label htmlFor="name" className={`${!username ? styles.hidden : null}`}>
                <span className={`${validUsername ? 'valid' : styles.hidden} ${styles.check}`}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={`${validUsername || !username ? styles.hidden : 'invalid'}
                  ${styles.x}`}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
              <p id='uidnote' className={`${usernameFocus && username &&
              !validUsername ? null : styles.offscreen}
              ${styles.note}`}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 23 characters. Must begin with a letter.<br />
                  Letters, numbers, underscores, hyphens allowed.
              </p>              
            </div>
            <div className={styles.field}>
              <input 
                required
                name='email'
                id='email'
                type='email' 
                placeholder='Email'
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
                onFocus={()=> setPwdFocus(true)}
                onBlur={()=>setPwdFocus(false)}
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
              <p id='pwdnote' className={`${pwdFocus && pwd &&
              !validPwd ? null : styles.offscreen}
              ${styles.note_p}`}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Minimum 4 characters.
              </p>
            </div>
            <input 
              required
              name='acc_type' 
              type='text' 
              value={accType} hidden readOnly/>
            <button disabled={!validUsername || !validEmail || !validPwd ? true : false}
            >Submit</button>
        </form>
          <button
              onClick={() => {
                navigate('/');
              }}>Go Back
          </button>
    </section>
  )
}

export default CreateAccount