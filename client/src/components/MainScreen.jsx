import styles from '../styles/MainScreen.module.css'
import { Suspense, useState} from 'react'
import { ShowMessageSeconds } from '../functions/ShowMessageSeconds'
import AccTypeChoice from './AccTypeChoice'
import CreateAccount from './CreateAccount'
import Log_In from './Log_In'
import Loading from './Loading'
import Venues from './Venues'
import useAuth from '../hooks/useAuth'

const MainScreen = () => {
  const [userStatus, setUserStatus] = useState('logged_out');
  const [userAction, setUserAction] = useState(null);
  const [activeEmail, setActiveEmail] = useState(null);
  const [accType, setAccType] = useState('venue');
  const messagePromise = ShowMessageSeconds(3);
  const { auth } = useAuth();

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
    <div className={`${styles.content} ${auth ? styles.hidden : null}`}>
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
        handleClick={handleClick}
        userAction={userAction}
        setUserAction={setUserAction}
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        activeEmail={activeEmail}
        setActiveEmail={setActiveEmail}
        accType={accType}
        setAccType={setAccType}
        />
      <Suspense fallback={<Loading userStatus={userStatus} message={
          userStatus === 'acc_created' ?
          'Your account has been successfully created!' :
          'LOADING...'}/>}>
        <Log_In
          handleClick={handleClick}
          messagePromise={messagePromise}
          userAction={userAction}
          setUserAction={setUserAction}
          userStatus={userStatus}
          setUserStatus={setUserStatus}
          setActiveEmail={setActiveEmail}
          accType={accType}
          setAccType={setAccType}
        />
      </Suspense>
    </div>
    <Suspense fallback={<Loading userStatus={userStatus} message={'LOADING...'}/>}>        
      <Venues userStatus={userStatus}/>
    </Suspense> 
    </>    
  )
}

export default MainScreen