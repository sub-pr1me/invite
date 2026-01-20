import styles from '../styles/Log_In.module.css'
import { useNavigate } from 'react-router-dom'
import axios from "../api/axios";
import useAuth from '../hooks/useAuth'

const Log_In = () => {
  
  const { setAuth, setActiveEmail } = useAuth();
  const navigate = useNavigate();

  async function LogIn(formData) {
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
      const name = response?.data?.username;

      setAuth({ email, roles: [accType], name, token: accessToken });
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