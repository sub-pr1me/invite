import styles from '../styles/Sign_In.module.css'
import axios from '../api/axios'
import { useContext } from 'react'
import AuthContext from '../context/AuthProvider'

const Log_Out = ({ setUserStatus, setUserAction }) => {
  const { setAuth, setVens } = useContext(AuthContext);

  async function SignOut() {

    try {
      await axios.get("/logout",
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true,
        }
      );
      console.log('LOGGED OUT');
      setUserAction(null);
      setAuth({});
      setUserStatus('logged_out');
      setVens('invisible');
    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else if (err.response?.status === 401) {
        console.log('UNAUTHORIZED');
      } else {
        console.log('LOGOUT FAILED');
      }
    }    
  };
  
  return (
    <button className={`${styles.container}`}
            onClick={SignOut}>
            LOG OUT
    </button>
  )
}

export default Log_Out