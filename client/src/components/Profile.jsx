import styles from '../styles/Profile.module.css'

const Profile = () => {
  return (
    <>
    <title>Profile</title>
    <div className={`${styles.profile_container}`}>
      <div>Change name</div>
      <div>Change email</div>
      <div>Change photos</div>
      <div>Change tables (venue)</div>
    </div>
    </>
  );
};

export default Profile