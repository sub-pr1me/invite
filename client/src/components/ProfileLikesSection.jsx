import styles from '../styles/ProfileLikesSection.module.css'
import useAuth from '../hooks/useAuth'
import UserProfile from './UserProfile'
import { useParams } from 'react-router-dom'

const ProfileLikesSection = ({ userData, setUserData, tablePreview, expanded, setExpanded }) => {
  const { auth } = useAuth();
  const { userId } = useParams();

  return (
    <>
      {userData?.likes?.length > 0 && !tablePreview &&
        <div className={`${styles.likes_container} ${expanded ? styles.expanded_container : null}`}>
          <div className={styles.title}>
            {!userId && auth.roles[0] === 'venue' && userData?.likes[0] ? 'People who like your place:' : null}
            {!userId && auth.roles[0] === 'customer' && userData?.likes[0] ? 'People who like you:' : null}
            {userId && userData?.dob && userData?.likes[0] ? 'People who like this person:' : null}
            {userId && !userData?.dob && userData?.likes[0] ? 'People who like this place:' : null}
          </div>
          <div className={`${styles.likes} ${expanded ? styles.expanded_content : null}`}>
            <div className={`${styles.limit} ${expanded ? styles.expanded_limit : null}`}>
              {
                userData?.likes.map(item => {
                  if (
                    !expanded && userData?.likes.indexOf(item) < 3
                    || expanded)
                  return (
                    <UserProfile 
                      key={item}
                      email={item}                      
                      role='customer'
                      setUserData={setUserData}
                      expanded={expanded}
                      setExpanded={setExpanded}
                    />
                  )
                })
              }
            </div>
          </div>
          <div className={`${styles.btn_container}`}>
            { userData?.likes?.length > 3 &&
              <button onClick={()=>{setExpanded(!expanded)}}>
                {!expanded ? 'View Full List' : 'Collapse'}
              </button>
            }
          </div>
        </div>
      }
    </>
  );
};

export default ProfileLikesSection;