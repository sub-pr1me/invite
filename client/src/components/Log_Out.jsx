import styles from '../styles/Log_Out.module.css'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'

const Log_Out = () => {
  const { setAuth } = useAuth();

  async function SignOut() {

    try {
      await axios.get("/logout",
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true,
        }
      );
      console.log('LOGGED OUT');
      setAuth(null);
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
    <button className={`${styles.logout_container}`}
            onClick={SignOut}>
            LOG OUT
    </button>
  )
}

export default Log_Out