import styles from '../styles/LayoutMain.module.css'
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import Loading from './Loading'
import Venues from './Venues'

const LayoutMain = () => {

  return (
    <>
    <title>Invite</title>    
    <div className={`${styles.bg_container}`}>
      <div className={`${styles.logo}`}>INVITE</div>
      <img className={`${styles.male}`} src='../../img/M.png' alt='' />
      <img className={`${styles.female}`} src='../../img/F.png' alt='' />
      <img className={`${styles.table}`} src='../../img/T.png' alt='' />
    </div>
    <div className={`${styles.content}`}>
      <Outlet />     
    </div>
    <Suspense fallback={<Loading message={''}/>}>        
      <Venues />
    </Suspense> 
    </>
  )
}

export default LayoutMain