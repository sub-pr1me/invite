import React from 'react'
import styles from '../styles/WelcomeScreen.module.css'
import { useState } from 'react'
import CreateAccount from './CreateAccount'
import Sign_In from './Sign_In'

const WelcomeScreen = () => {
  const [userAction, setUserAction] = useState(null);

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
      <div className={`${styles.btns_div}
                       ${userAction ? styles.hidden : null}`}>
        <button onClick={() => handleClick('create_acc')}>Create Account</button>
        <button onClick={() => handleClick('sign_in')}>Sign In</button>
      </div>        

      <CreateAccount userAction={userAction}/>
      <Sign_In userAction={userAction}/>

      <button className={`${!userAction ? styles.hidden : null}`}
          onClick={() => handleClick('back')}>Go Back</button>      
    </div>
    <h4>POPULAR VENUES:</h4>
    </>    
  )
}

export default WelcomeScreen