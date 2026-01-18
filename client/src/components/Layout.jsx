import { Outlet, Link } from 'react-router-dom'
import styles from '../styles/Layout.module.css'
import useAuth from '../hooks/useAuth'
import Log_Out from './Log_Out'

const Layout = () => {
  const { auth } = useAuth();
  return (
    <>
    <div className={`${styles.dash_container} ${!auth ? styles.hidden : null}`}>
      <header>
        <div className={`${styles.user}`}>
          <div className={`${styles.profile_pic}`}>PIC</div>
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
        <Link to='/'>HOME</Link>
        <Link to='/clients'>CLIENTS</Link>
        <Link to='/profile'>PROFILE</Link>
        <Link to='/auctions'>AUCTIONS</Link>
        <Link to='/stats'>STATS</Link>
      </nav>
    </div>      
    </>
  )
}

export default Layout