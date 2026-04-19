import useAuth from '../hooks/useAuth'
import styles from '../styles/ProfileLike.module.css'


const ProfileLike = ({ icon, liked, switchLike }) => {
    const { auth } = useAuth();

  return (
    <>
      <div className={styles.like_container} onClick={()=>{switchLike(auth.email)}}>
        <img 
          src={icon === 'heart' ? '../../img/heart.png' : '../../img/star.png'} alt=''
          className={`${icon === 'heart' ? styles.move_down : null} ${liked ? styles.liked : null}`}
        />  
      </div>
    </>
  );
};

export default ProfileLike