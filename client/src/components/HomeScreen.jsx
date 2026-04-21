import styles from '../styles/HomeScreen.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useEffectEvent, memo } from 'react'
import ProfileTopSection from './ProfileTopSection'
import ProfileLikesSection from './ProfileLikesSection'
import Carousel from './Carousel'
import AlbumUpload from './AlbumUpload'

const HomeScreen = () => {
  console.log('RENDERED');

  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [albumUploadPending, setAlbumUploadPending] = useState(false);
  console.log('USER ID PRE: ',userId);

  const applyUserData = useEffectEvent(async (userId)=>{
    if (!userId) {
      setUserData(auth);
    } else {
      console.log('USER ID EXISTS');
      try {
        const response = await axiosPrivate.get('/fetch_profile_data',
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true,
            params: {
              role: userId[0] === 'c' ? 'customer' : 'venue',
              id: userId[0] === 'c' ? userId?.substring(8) : userId?.substring(5),
              from: 'HomeScreen'
            }
          }
        );
        setUserData(response.data);
      } catch (err) {
        console.log(err);
      };
    };
  });

  useEffect(()=>{
    console.log('USER ID POST: ',userId);
    applyUserData(userId);
  },[userId]);

  return (
    <>
      <div className={`${styles.homescreen_container}`}>
        <div className={`${styles.edge_fader}`}></div>
        {albumUploadPending &&
          <div className={`${styles.upload_modal}`}>
            <AlbumUpload 
              setAlbumUploadPending={setAlbumUploadPending}
              albumUploadPending={albumUploadPending}
              postreg={true}
            />
          </div>
        }
        <Carousel />
        {!albumUploadPending && <ProfileTopSection userData={userData} setUserData={setUserData}/>}
        {auth.roles[0] === 'customer' && !auth.album && !userId && !albumUploadPending &&
          <div className={`${styles.no_photos}`}>
            Upload some photos <br />
            to make your profile more attractive!
            <button onClick={()=>{setAlbumUploadPending(true)}}>Let's do it!</button>
          </div>          
        }
        {!albumUploadPending && <ProfileLikesSection userData={userData} setUserData={setUserData}/>}        
      </div>
    </>
  );
};

export default memo(HomeScreen);