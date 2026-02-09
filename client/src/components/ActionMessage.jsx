import styles from '../styles/AccCreatedMessage.module.css'
import {useLocation} from 'react-router-dom';

const ActionMessage = () => {
  const location = useLocation();
  
  return (
    <div className={`${styles.container}`}>
      {
        location.state.msg === 'ok' ?
        <h3>Account created!</h3> :
        <h3>Account with this email <br /> already exists!</h3> 
      }
    </div>
  )
};

export default ActionMessage