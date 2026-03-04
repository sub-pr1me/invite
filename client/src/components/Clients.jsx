import styles from '../styles/Clients.module.css'

const Clients = () => {
  return (
    <>
    <title>Clients</title>
    <div className={`${styles.clients_container}`}>
      <div>Hosts</div>
      <div>Guests</div>
      <div>Explore</div>
    </div>
    </>   
  );
};

export default Clients