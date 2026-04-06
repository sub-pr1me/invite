import styles from '../styles/HomeScreen.module.css'
import { useParams } from 'react-router-dom';

const HomeScreen = () => {
  const { userId } = useParams();
  let role;
  let id;
  if (userId) {role = userId[0] === 'c' ? 'customer' : 'venue'};
  if (role === 'customer') {id = userId?.substring(8)} else {id = userId?.substring(5)};

  return (
    <>
      <div className={`${styles.homescreen_container}`}>
        <div>USER ID: {userId}</div>
        <div>Logo / Avatar</div>
        <div>Name</div>
        <div>Photos</div>
        <div>Balance</div>
        <div>Likes</div>
        <div>Compliments</div>
        <div>Dates</div>
        <div>Popular Venues</div>
      </div>
    </>
  );
};

export default HomeScreen