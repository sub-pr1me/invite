import styles from '../styles/Log_In.module.css'
import { use } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import UserLogIn from '../functions/UserLogIn'

const Log_In = ({ messagePromise, userStatus, setUserStatus, setActiveEmail }) => {
  
  const { auth, setAuth} = useAuth();
  const navigate = useNavigate();
  if (userStatus === 'acc_created') use(messagePromise);

  async function LogIn(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    try {      
      const response = await UserLogIn(email, password);
      const accessToken = response?.data?.accessToken;
      const accType = response?.data?.accType;
      const name = response?.data?.username;
      const currentPage = response?.data?.currentPage;

      setAuth({ email, roles: [accType], name, token: accessToken, currentPage });
      setUserStatus('logged_in');
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
        <input required name='email' type="email" placeholder='Email'/>
        <input required name='password' type="password" placeholder='Password'/>        
          <button>Submit</button>
      </form>
        <button className={`${!auth ? null : styles.hidden}`}
            onClick={() => {
              setUserStatus('logged_out')
              setActiveEmail(null);
              navigate('/');
            }}>Go Back
        </button>   
    </div>
  )
}

export default Log_In