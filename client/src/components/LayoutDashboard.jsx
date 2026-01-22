import { Outlet, Link } from 'react-router-dom'
import styles from '../styles/LayoutDashboard.module.css'
import useAuth from '../hooks/useAuth'
import Log_Out from './Log_Out'

const LayoutDashboard = () => {
  const { auth } = useAuth();

  function addLogo() {
    
  };

  return (
    <>
    <div className={`${styles.dash_container}`}>
      <header>
        <img src="../../img/arrow.png" alt="" className={`${auth.avatar ? styles.hidden : null} ${styles.arrow}`}/>
        <div className={`${styles.user}`}>
          <div className={`${styles.avatar} ${auth.stage === '0' ? styles.border : null}`}>
            <img src={auth.avatar} alt="LOGO" className={`${!auth.avatar ? styles.hidden : null} ${styles.logo}`}/>
            <img src="../../img/add.png"
                 alt="ADD"
                 className={`${auth.avatar ? styles.hidden : null} ${styles.add}`}
                 onClick={()=>{addLogo}}
            />
          </div>
          <div className={`${styles.userdata}`}>
            <div className={`${styles.name}`}>{auth.name}</div>
            <div className={`${styles.email}`}>{auth.email}</div>
          </div>
        </div>
        <div className={`${styles.logout}`}>
          <Link to='/'><Log_Out /></Link>          
        </div>          
      </header>
      <main>
        <Outlet />
      </main>
      <nav>
        <Link to='/dashboard/'>HOME</Link>
        <Link to='/dashboard/clients'>CLIENTS</Link>
        <Link to='/dashboard/profile'>PROFILE</Link>
        <Link to='/dashboard/auctions'>AUCTIONS</Link>
        <Link to='/dashboard/stats'>STATS</Link>
      </nav>
    </div>      
    </>
  )
}

export default LayoutDashboard