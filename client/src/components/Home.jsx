import useAuth from '../hooks/useAuth'
import styles from '../styles/Home.module.css'
import { useEffect, useEffectEvent } from 'react';

const Home = () => {

  const { auth } = useAuth();
  const onRefresh = useEffectEvent(()=>{console.log(auth)});
  
  useEffect(()=>{
    onRefresh();
  },[])

  return (
    <>
    <title>Home</title>
    <div className={`${auth.stage !== '0' ? styles.hidden : null}`}>
      <div className={`${styles.welcome}`}>Welcome!<br/>{
        auth.roles[0] === 'venue' ?
        `Please start by uploading your venue's logo!` :
        `Please start by uploading your profile photo!` 
      }</div>
    </div>
    
    <div className={`${auth.stage !== '1' ? styles.hidden : null}`}>
      <div className={`${styles.welcome}`}>{
        auth.roles[0] === 'venue' ?
        <div>
          {`Now, upload some photos of your venue's interiors!`}<br /><br />
          {`We also recommend you to add a few images`}<br />
          {`of your fanciest dishes and cocktails.`}<br /><br />
          <button>Upload</button>
        </div> :
        <div>
          {`You can now upload more photos of yourself to your album!`}<br />
          <button>Upload</button>
          <button>Maybe Later</button>
        </div>
        }</div>
    </div>
    <div className={`${auth.stage !== '2' ? styles.hidden : null}`}>STAGE 2 - FILL OUT INFO</div>
    <div className={`${auth.stage !== '3' ? styles.hidden : null}`}>STAGE 3 - SET AUCTION</div>
    <div className={`${auth.stage !== '4' ? styles.hidden : null}`}>STAGE 4 - VISIBLE</div>
    </>    
  )
}

export default Home