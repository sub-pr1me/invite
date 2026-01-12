import styles from '../styles/VenueDashboard.module.css'
import useAuth from '../hooks/useAuth'
import { GetUserData } from '../functions/GetUserData'
import Log_Out from './Log_Out'
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const VenueDashboard = ({ accType, userStatus, setUserStatus, setUserAction }) => {
  
  const { auth } = useAuth(); // Contains email + token
  const axiosPrivate = useAxiosPrivate();
  
  if (userStatus !== 'logged_in' || accType !== 'venue') return null

  return (
    <>
    <div className={`${styles.container}
                     ${(userStatus !== 'logged_in' || accType !== 'venue') ? styles.hidden : null}`}>     
      <header>
        <div className={`${styles.user}`}>
          <div className={`${styles.profile_pic}`}>PIC</div>
          <div className={`${styles.email}`}>{auth.email}</div>
        </div>
        <div className={`${styles.logout}`}>
          <Log_Out setUserStatus={setUserStatus} setUserAction={setUserAction}
        /></div>          
      </header>
      <main>
        <button onClick={() => GetUserData(axiosPrivate, auth.token, accType, userStatus, auth.email)}>GET DATA</button>
      </main>
      <nav>
        <div>HOME</div>
        <div>SEARCH</div>
        <div>PROFILE</div>          
      </nav>
    </div>
    </>
  )
}

export default VenueDashboard