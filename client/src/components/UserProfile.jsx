import styles from '../styles/UserProfile.module.css'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const UserProfile = ({ likesSection, name, avatar, role, id,setUserData, expanded, setExpanded, passedID, host, guest }) => {
  const { auth } = useAuth();

  return (
    <>
      <div 
        className={`${styles.user_container}`}
        onClick={()=>{
          if (!passedID) setTimeout(() => {setUserData(null)}, 0);
          if (expanded) setExpanded(null);
        }}>
        <Link to={`/dashboard/${passedID ? role+passedID : (role === auth.roles[0] && id === auth.id) ? '' : `${role}${id}`}`}>
          <img src={avatar} alt='' />
          {name && !likesSection &&
            <div>{name}</div>
          }
        </Link>
        {auth.roles[0] === 'venue' && host &&
        <div className={`${styles.host_label}`}>H</div>
        }
        {auth.roles[0] === 'venue' && guest &&
        <div className={`${styles.guest_label}`}>G</div>
        }
      </div>
    </>
  );
};

export default memo(UserProfile);