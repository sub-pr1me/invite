import React from 'react'
import styles from '../styles/WelcomeScreen.module.css'
import { useState, Suspense } from 'react'
import { ShowMessageSeconds } from '../functions/ShowMessageSeconds'
import AccTypeChoice from './AccTypeChoice'
import CreateAccount from './CreateAccount'
import Sign_In from './Sign_In'
import Loading from './Loading';

const WelcomeScreen = () => {
  const [userAction, setUserAction] = useState(null);
  const [userStatus, setUserStatus] = useState('logged_out');
  const [activeEmail, setActiveEmail] = useState(null);
  const [accType, setAccType] = useState('venue');

  const messagePromise = ShowMessageSeconds(3);

  function handleClick(action) {    

    if (action === 'create_acc') {
      setUserAction('create_acc')
    } else if (action === 'sign_in'){
      setUserAction('sign_in')
    } else {
      setUserAction(null)
    };
  };

  return (
    <>
    <div className={`${styles.content}`}>

      <AccTypeChoice
        userAction={userAction}
        accType={accType}
        setAccType={setAccType}
      />

      <div className={`${styles.btns_div}
                 ${userAction ? styles.hidden : null}`}>
        <button onClick={() => handleClick('create_acc')}>Create Account</button>
        <button onClick={() => handleClick('sign_in')}>Log In</button>
      </div>

      <CreateAccount
        userAction={userAction}
        setUserAction={setUserAction}
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        activeEmail={activeEmail}
        setActiveEmail={setActiveEmail}
        accType={accType}
        />

      <Suspense fallback={<Loading message={
          userStatus === 'acc_created' ? 'Your account has been successfully created!' : 'LOADING...'}/>}>
        <Sign_In
        messagePromise={messagePromise}
        userAction={userAction}
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        activeEmail={activeEmail}
        setActiveEmail={setActiveEmail}
        />
      </Suspense>

      <button className={`${!userAction ? styles.hidden : null}`}
          onClick={() => {
            handleClick('back');
            setUserStatus('logged_out')
            setActiveEmail(null);
            setAccType('venue');
            setUserAction(null);
          }}>Go Back</button>      
    </div>
    </>    
  )
}

export default WelcomeScreen