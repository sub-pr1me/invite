import styles from '../styles/Dashboard.module.css'
import useAuth from '../hooks/useAuth'
import Log_Out from './Log_Out'


const Dashboard = ({ setUserStatus, setUserAction }) => {
  
  const { auth } = useAuth(); // Contains email + role + token
  
  if (!auth) return null;

  return (
    <>
    <div className={`${styles.container} ${!auth ? styles.hidden : null}`}>
      <header>
        <div className={`${styles.user}`}>
          <div className={`${styles.profile_pic}`}>PIC</div>
          <div className={`${styles.userdata}`}>
            <div className={`${styles.name}`}>{auth.name}</div>
            <div className={`${styles.email}`}>{auth.email}</div>
          </div>          
        </div>
        <div className={`${styles.logout}`}>
          <Log_Out setUserStatus={setUserStatus} setUserAction={setUserAction} />
        </div>          
      </header>
      <main>
        <button onClick={()=> {console.log('AUTH - ', auth)}}>GET DATA</button>
      </main>
      <nav>
        <div>HOME</div>
        <div>CLIENTS</div>
        <div>PROFILE</div>
        <div>AUCTIONS</div>
        <div>STATS</div>
      </nav>
    </div>
    </>
  )
}

export default Dashboard