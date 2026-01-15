import styles from '../styles/Sign_In.module.css'
import { use } from 'react'
import useAuth from '../hooks/useAuth'
import UserSignIn from '../functions/UserSignIn'

const Sign_In = ({ handleClick, messagePromise, userAction, setUserAction, 
                   userStatus, setUserStatus, setActiveEmail, setAccType }) => {
  
  const { setAuth, setVens } = useAuth();
  if (userStatus === 'acc_created') use(messagePromise);

  async function LogIn(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    try {      
      const response = await UserSignIn(email, password);
      const accessToken = response?.data?.accessToken;
      setAuth({ email, token: accessToken });
      setUserStatus('logged_in');
      setUserAction('main_page');
      setVens('invisible');
      console.log('LOGGED IN');
      
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
    <div className={`${userAction !== 'sign_in' ? styles.hidden : null}
                     ${styles.container}`}>
      <h2>Log In:</h2>
      <form action={LogIn}>
        <input name='email' type="email" placeholder='Email'/>
        <input name='password' type="password" placeholder='Password'/>
        <button>Submit</button>
      </form>
      <button className={`${!userAction ? styles.hidden : null}
      ${userStatus === 'acc_created' || userStatus === 'logged_out' ? null : styles.hidden}`}
          onClick={() => {
            handleClick('back');
            setUserStatus('logged_out')
            setActiveEmail(null);
            setAccType('venue');
            setUserAction(null);
          }}>Go Back
      </button>
    </div>
  )
}

export default Sign_In