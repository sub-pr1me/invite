import { Outlet, Link } from 'react-router-dom'
import styles from '../styles/LayoutDashboard.module.css'
import useAuth from '../hooks/useAuth'
import Log_Out from './Log_Out'
import LogoUpload from './LogoUpload'

const LayoutDashboard = () => {
  
  const { auth, active, setActive } = useAuth();

  return (
    <>
    <div className={`${styles.dash_container}`}>
      <header>
        <img src='../../img/arrow.png' alt='' className={`${auth.avatar ? styles.hidden : null} ${styles.arrow}`}/>
        <div className={`${styles.user}`}>
          <div className={`${styles.avatar} ${auth.stage === '0' ? styles.border : null}`}>
            <LogoUpload />
          </div>
          <div className={`${styles.userdata}`}>
            <div className={`${styles.name}`}>{auth.name}</div>
            <div className={`${styles.divider}`}></div>
            <div className={`${styles.email}`}>{auth.email}</div>
          </div>
        </div>
        <div className={`${styles.logout}`}>
          <Log_Out />
        </div>
      </header>
      <main className={`${auth.stage !== '4' ? styles.fullscreen : null}`}>
        <Outlet />
      </main>
      <nav className={`${auth.stage !== '4' ? styles.hidden : null}`}>
        <Link to='/dashboard/' onClick={()=>{setActive('home')}} >
          <img            
            className={`${active === 'home' ? styles.selected : null}`}
            src='../../img/home.png' alt='' />
        </Link>
        {
        auth.roles[0] === 'venue'
        &&
        <Link to='/dashboard/clients' onClick={()=>{setActive('clients')}}>
          <img
            className={`${active === 'clients' ? styles.selected : null}`} 
            src='../../img/clients.png' alt='' />
        </Link>
        }
        {
        auth.roles[0] === 'customer'
        &&
        <Link to='/dashboard/explore' onClick={()=>{setActive('explore')}}>
          <img
            className={`${active === 'explore' ? styles.selected : null}`} 
            src='../../img/explore.png' alt='' />
        </Link>
        }
        <Link to='/dashboard/profile' onClick={()=>{setActive('profile')}}>
          <img
            className={`${active === 'profile' ? styles.selected : null}`} 
            src='../../img/profile.png' alt='' />
        </Link>
        <Link to='/dashboard/auctions' onClick={()=>{setActive('auctions')}}>
          <img
            className={`${active === 'auctions' ? styles.selected : null}`} 
            src='../../img/auctions.png' alt='' />
        </Link>
        <Link to='/dashboard/cashier' onClick={()=>{setActive('cashier')}}>
          <img
            className={`${active === 'cashier' ? styles.selected : null}`} 
            src='../../img/dollar.png' alt='' />
        </Link>
      </nav>
    </div>
    </>
  );
};

export default LayoutDashboard