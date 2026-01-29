import useAuth from '../hooks/useAuth'
import styles from '../styles/Home.module.css'
import { useEffect, useEffectEvent } from 'react'
import AlbumUpload from './AlbumUpload'

const Home = () => {

  const { auth } = useAuth();
  const onRefresh = useEffectEvent(()=>{console.log(auth)});
  
  useEffect(()=>{
    onRefresh();
  },[])

  return (
    <>
    <title>Home</title>

    <div className={`${auth.stage !== '0' ? styles.hidden : null} ${styles.container}`}>
      <div className={`${styles.welcome}`}>Welcome!<br/>{
        auth.roles[0] === 'venue' ?
        `Please start by uploading your venue's logo!` :
        `Please start by uploading your profile photo!` 
      }</div>
    </div>

    <div className={`${auth.stage !== '1' ? styles.hidden : null} ${styles.stage2_screen}`}>
      <AlbumUpload />      
    </div>

    <div className={`${auth.stage !== '2' ? styles.hidden : null}`}>STAGE 2 - FILL OUT INFO</div>
    <div className={`${auth.stage !== '3' ? styles.hidden : null}`}>STAGE 3 - SET AUCTION</div>
    <div className={`${auth.stage !== '4' ? styles.hidden : null}`}>STAGE 4 - VISIBLE</div>
    </>    
  )
}

export default Home