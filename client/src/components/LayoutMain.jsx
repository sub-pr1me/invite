import styles from '../styles/LayoutMain.module.css'
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import Loading from './Loading'
import Venues from './Venues'

const LayoutMain = () => {

  return (
    <>
    <title>Invite</title>
    <div className={`${styles.content}`}>
      <Outlet />     
    </div>
    <Suspense fallback={<Loading message={'LOADING...'}/>}>        
      <Venues />
    </Suspense> 
    </>
  )
}

export default LayoutMain