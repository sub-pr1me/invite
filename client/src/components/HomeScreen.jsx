import styles from '../styles/HomeScreen.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useEffectEvent, memo } from 'react'
import ProfileTopSection from './ProfileTopSection'
import ProfileDatesSection from './ProfileDatesSection'
import ProfileLikesSection from './ProfileLikesSection'
import Carousel from './Carousel'
import AlbumUpload from './AlbumUpload'

const HomeScreen = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [albumUploadPending, setAlbumUploadPending] = useState(false);
  const [tablePreview, setTablePreview] = useState(false);

  const upcomingDates = auth.dates?.filter(item => item.status === 'upcoming');

  const applyUserData = useEffectEvent(async (userId)=>{
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
  });

  useEffect(()=>{
    if (userId) applyUserData(userId);
    if (!userId) applyUserData(auth.roles[0]+auth.id);
  },[userId, auth.roles, auth.id, auth.dates, albumUploadPending, upcomingDates?.length]);

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

        {!tablePreview && 
        <Carousel />
        }

        {!albumUploadPending && 
         !tablePreview && 
         <ProfileTopSection userData={userData} setUserData={setUserData}/>
        }
        
        {auth.roles[0] === 'customer' && !auth.album && !userId && !albumUploadPending && !tablePreview &&
          <div className={`${styles.no_photos} ${!auth.likes && !upcomingDates?.length ? styles.shifted : null}`}>
            Upload some photos <br />
            to make your profile more attractive!
            <button onClick={()=>{setAlbumUploadPending(true)}}>Let's do it!</button>
          </div>          
        }

        {auth.dates?.length > 0 && !userId && !albumUploadPending && upcomingDates?.length > 0 &&
          <ProfileDatesSection 
            dates={upcomingDates} 
            tablePreview={tablePreview} 
            setTablePreview={setTablePreview}
          />
        }

        {!albumUploadPending && 
          <ProfileLikesSection 
            userData={userData} 
            setUserData={setUserData}
            tablePreview={tablePreview}
          />
        }
      </div>
    </>
  );
};

export default memo(HomeScreen);