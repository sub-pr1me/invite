import useAuth from '../hooks/useAuth'
import styles from '../styles/Home.module.css'
import { useEffect, useEffectEvent } from 'react'
import AlbumUpload from './AlbumUpload'
import InfoUpload from './InfoUpload'
import SetAuctions from './SetAuctions'
import HomeScreen from './HomeScreen'

const Home = () => {

  const { auth } = useAuth();
  const onRefresh = useEffectEvent(()=>{console.log(auth)});
  
  useEffect(()=>{
    onRefresh();
  },[])

  return (
    <>
    <title>Home</title>
    <div  className={`${styles.container}`}>
      {
        auth.stage === '0' && 
        <div className={`${styles.welcome}`}>Welcome!<br/>{
          auth.roles[0] === 'venue' ?
          `Please start by uploading your venue's logo!` :
          `Please start by uploading your profile photo!`}
        </div>
      }
      {auth.stage === '1' && <AlbumUpload />}
      {auth.stage === '2' && <InfoUpload />}
      {auth.stage === '3' && auth.tables && <SetAuctions />}
      {auth.stage === '4' && <HomeScreen />}
    </div>
    </>    
  );
};

export default Home