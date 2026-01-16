import styles from '../styles/Dashboard.module.css'
import useAuth from '../hooks/useAuth'
import { GetUserData } from '../functions/GetUserData'
import Log_Out from './Log_Out'
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Dashboard = ({ accType, userStatus, setUserStatus, setUserAction }) => {
  
  const { auth } = useAuth(); // Contains email + role + token
  const axiosPrivate = useAxiosPrivate();
  const getRandomKey = () => crypto.randomUUID();
  
  if (!auth) return null;

  return (
    <>
    <div className={`${styles.container} ${!auth ? styles.hidden : null}`}>
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
        <div>{auth.roles.map((role) => (<h3 key={getRandomKey()} >{role}</h3>))}</div>
        <button onClick={() => GetUserData(axiosPrivate, auth.token, accType, userStatus)}>GET DATA</button>
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

export default Dashboard