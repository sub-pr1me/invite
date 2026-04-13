import styles from '../styles/HomeScreen.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useEffectEvent } from 'react'
import Thumb from './Thumb'
import Person from './Person'
import LikesLoading from './LikesLoading'

const HomeScreen = ({ setVisit }) => {
  const [profileData, setProfileData] = useState(null);
  const [liked, setLiked] = useState(false);
  const [status, setStatus] = useState('idle');
  const [expanded, setExpanded] = useState(false);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { userId } = useParams();
  const getRandomKey = () => crypto.randomUUID();
  const navigate = useNavigate();

  let role;
  let id;
  let age = null;
  let showLikes = false;
  let canLike = false;

  if (userId) {role = userId[0] === 'c' ? 'customer' : 'venue'};
  if (role === 'customer') {id = userId?.substring(8)} else {id = userId?.substring(5)};
  if (!role && auth.roles[0] === 'venue' && auth.likes) showLikes = true;
  if (role && profileData?.likes) showLikes = true;

  if (profileData?.interest && auth.gender === profileData?.interest) canLike = true;
  if (role === 'venue') canLike = true;

  if (role === 'customer') age = getAge(profileData?.dob);
  if (auth.roles[0] === 'customer' && !role) age = auth.age;
  
  function getAge(dob) {
    const date = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - date.getFullYear();
    const monthDifference = currentDate.getMonth() - date.getMonth();
    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < date.getDate())) {
        age--;
    };
    return age;
  };

  const FetchProfileData = useEffectEvent(async (role, id) => {
    try {
      const response = await axiosPrivate.get('/fetch_profile_data',
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true,
          params: {role: role, id: id}
        }
      );
      response.data.credits = parseInt(response.data.credits);
      if (role === 'venue') {
        response.data.name = response.data.venue;
        delete response.data.venue;
      };
      if (role === 'customer') {
        response.data.name = response.data.customer;
        response.data.age = getAge(response.data.dob)
        delete response.data.customer;
      };
      setProfileData(response.data);
    } catch (err) {
      console.log(err);
    };
  });

  const likeIsOn = useEffectEvent((arg)=>{setLiked(arg)});

  const switchLike = async (email) => {
    try {      
      const response = await axiosPrivate.post('/switch_like',
        {email: email, role: role, id: id},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );

      if (profileData) {setProfileData({...profileData, likes: response.data})};      
      setLiked(!liked);
      setStatus('success');

    } catch (err) {
      console.log(err);
    };
  };

  const VisitProfile = (id) => {
    if (role) setVisit(`${getRandomKey()}-${id}`);
    setProfileData(null);
    setExpanded(false);
    navigate(`/dashboard/${id}`);
  };

  const ResetProfileData = () => {
    setProfileData(null);
    setExpanded(false);
  };
  const ResetStatus = useEffectEvent(() => {setStatus('idle')});

  useEffect(()=>{
    if (userId && !profileData) FetchProfileData(role, id);
    if (auth.roles[0] === 'venue' && !role && auth.likes[0]) likeIsOn(true);
    if (auth.roles[0] === 'venue' && !role && !auth.likes[0]) likeIsOn(false);
    if (status === 'success') ResetStatus();

    window.addEventListener("popstate", () => {ResetProfileData()});

  },[userId, profileData, role, id, auth.roles, auth.likes, liked, auth.email, status]);

  return (
    <>
      <div className={`${styles.homescreen_container}`}>
        <div className={`${styles.edge_fader}`}></div>
        <div className={`${styles.top}`}>
          <div className={`${styles.avatar}`}>
            <img src={auth && !role ? auth.avatar : profileData?.avatar} alt='' />
          </div>
          {role 
           && auth.roles[0] !== 'venue'
           && canLike 
           &&
            <div 
              className={`
                ${styles.favourite} 
                ${profileData?.likes?.includes(auth.email) ? styles.liked : null}
              `}
              onClick={()=>{                
                if (role === 'venue') {
                  setStatus('pending');
                  setTimeout(() => {switchLike(auth.email)}, 800);
                } else {switchLike(auth.email)};
              }}
            >
              <img src={role === 'customer' ? '../../img/heart.png' : '../../img/star.png'} alt='' />
            </div>
          }
          <div className={`${styles.name}`}>
            {`${auth && !role ? auth.name : profileData?.name}${age? ' (' + age + ')': ''}`}
          </div>
          <div className={`${styles.hours}`}>{auth && !role ? auth.hours : profileData?.hours}</div>
        </div>
        <div className={`${styles.carousel}`}>
          <div className={`${styles.album}`}>
              {!role ?
                auth?.album?.map(item => {
                return (
                <Thumb
                  key={auth?.album?.indexOf(item)}
                  cloudName={item.split('/')[3]}
                  publicId={item.split('/')[7].split('.')[0]}
                  alt={''}
                />
                )})
                :
                profileData?.album?.map(item => {
                return (
                <Thumb
                  key={profileData?.album.indexOf(item)}
                  cloudName={item.split('/')[3]}
                  publicId={item.split('/')[7].split('.')[0]}
                  alt={''}
                />
                )})
              }           
          </div>
          <div className={`${styles.album}`} aria-hidden>
              {!role ?
                auth?.album?.map(item => {
                return (
                <Thumb
                  key={auth?.album?.indexOf(item)}
                  cloudName={item.split('/')[3]}
                  publicId={item.split('/')[7].split('.')[0]}
                  alt={''}
                />
                )})
                :
                profileData?.album?.map(item => {
                return (
                <Thumb
                  key={profileData?.album.indexOf(item)}
                  cloudName={item.split('/')[3]}
                  publicId={item.split('/')[7].split('.')[0]}
                  alt={''}
                />
                )})
              }           
          </div>
        </div>
        {showLikes 
         && auth.roles[0] === 'venue' 
         && auth.likes[0] 
         && !role         
         &&
          <div className={`${styles.likes_container} ${expanded ? styles.expanded_container : null}`}>
            <div className={`${styles.likes_title}`}>
              People who like this {role === 'customer' ? 'person' : 'place'}:
            </div>
            <div className={`${styles.likes_content} ${expanded ? styles.expanded_content : null}`}>
              {status === 'pending'
               &&
               <LikesLoading />
              }
              {auth?.likes 
               && auth?.likes[0] 
               && status !== 'pending' 
               &&
                auth.likes.map(item => {
                  if (!expanded) {
                    if (auth.likes.indexOf(item) < 3) {
                      return (
                        <Person 
                          email={item} 
                          role='customer' 
                          key={item} 
                          VisitProfile={VisitProfile}
                          setProfileData={setProfileData}
                        />
                      );
                    };
                  } else {
                    if (auth.likes.length < 4) setExpanded(false);
                    return (
                        <Person 
                          email={item} 
                          role='customer' 
                          key={item} 
                          VisitProfile={VisitProfile}
                          setProfileData={setProfileData}
                        />
                    );
                  };
                })
              }
            </div>
            <div className={`${styles.btn_container}`}>
              {auth?.likes?.length > 3 
               && status !== 'pending' 
               &&
               <button onClick={()=>{setExpanded(!expanded)}}>{expanded ? 'Collapse' : 'See Full List'}</button>
              }
            </div>
          </div>
        }
        {showLikes
         && auth.roles[0] === 'customer' 
         && profileData?.likes[0] 
         && role !== 'customer'         
         &&
          <div className={`${styles.likes_container} ${expanded ? styles.expanded_container : null}`}>
            <div className={`${styles.likes_title}`}>
              People who like this {role === 'customer' ? 'person' : 'place'}:
            </div>
            <div className={`${styles.likes_content} ${expanded ? styles.expanded_content : null}`}>
              {status === 'pending'
               &&
               <LikesLoading />
              }
              {status !== 'pending' &&
                profileData?.likes.map(item => {
                  if (!expanded) {  
                    if (profileData?.likes?.indexOf(item) < 3) {
                      return (
                        <Person 
                          email={item} 
                          role='customer' 
                          key={getRandomKey()} 
                          VisitProfile={VisitProfile}
                          setProfileData={setProfileData}
                        />
                      );
                    };
                  } else {
                    return (
                        <Person 
                          email={item} 
                          role='customer' 
                          key={getRandomKey()} 
                          VisitProfile={VisitProfile}
                          setProfileData={setProfileData}
                        />
                    );
                  }; 
                })
              }
            </div>
            <div className={`${styles.btn_container}`}>
              {profileData?.likes?.length > 3 
               && status !== 'pending' 
               &&
               <button onClick={()=>{setExpanded(!expanded)}}>{expanded ? 'Collapse' : 'See Full List'}</button>
              }
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default HomeScreen