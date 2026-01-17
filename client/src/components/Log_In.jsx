import styles from '../styles/Sign_In.module.css'
import { use } from 'react'
import useAuth from '../hooks/useAuth'
import UserLogIn from '../functions/UserLogIn'

const Log_In = ({ handleClick, messagePromise, userAction, setUserAction, 
                  userStatus, setUserStatus, setActiveEmail, setAccType }) => {
  
  const { setAuth } = useAuth();
  if (userStatus === 'acc_created') use(messagePromise);

  async function LogIn(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    try {      
      const response = await UserLogIn(email, password);
      const accessToken = response?.data?.accessToken;
      const accType = response?.data?.accType;
      const name = response?.data?.username;
      const currentpage = response?.data?.currentpage;

      setAuth({ email, roles: [accType], name, token: accessToken, currentpage });
      setAccType(accType);
      setUserStatus('logged_in');
      setUserAction('main_page');
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
        <input required name='email' type="email" placeholder='Email'/>
        <input required name='password' type="password" placeholder='Password'/>
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

export default Log_In