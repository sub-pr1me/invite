import styles from '../styles/Dashboard.module.css'
import Log_Out from './Log_Out'

const Dashboard = ({ userStatus, setUserStatus, setUserAction }) => {
  return (
    <>
      <div className={`${styles.container} ${userStatus !== 'logged_in' ? styles.hidden : null}`}>
        <div>DASHBOARD</div>
        <Log_Out
          setUserStatus={setUserStatus}
          setUserAction={setUserAction}
        />
      </div>
    </>
  )
}

export default Dashboard