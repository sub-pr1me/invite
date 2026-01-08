import styles from '../styles/Sign_In.module.css'
import axios from 'axios'

const Log_Out = ({ setUserStatus, setUserAction }) => {

  async function SignOut() {

    try {
      await axios.get("http://localhost:3000/logout",
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true,
        }
      );
      console.log('LOGGED OUT');
      setUserAction(null);
      setUserStatus('logged_out');

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