import styles from '../styles/VenueDashboard.module.css'
import { GetUserData } from '../functions/GetUserData';
import Log_Out from './Log_Out'

const VenueDashboard = ({ token, accType, email, userStatus, setUserStatus, setUserAction }) => {
  
  if (userStatus !== 'logged_in' || accType !== 'venue') return null
  console.log('TOKEN -', token);
  return (
    <>
    <div className={`${styles.container}
                     ${(userStatus !== 'logged_in' || accType !== 'venue') ? styles.hidden : null}`}>     
      <header>
        <div className={`${styles.user}`}>
          <div className={`${styles.profile_pic}`}>PIC</div>
          <div className={`${styles.email}`}>{email}</div>
        </div>
        <div className={`${styles.logout}`}>
          <Log_Out setUserStatus={setUserStatus} setUserAction={setUserAction}
        /></div>          
      </header>
      <main>
        <div>NO DATA YET</div>
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