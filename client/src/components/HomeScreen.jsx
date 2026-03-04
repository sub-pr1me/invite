import styles from '../styles/HomeScreen.module.css'

const HomeScreen = () => {
  return (
    <>
      <div className={`${styles.homescreen_container}`}>
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