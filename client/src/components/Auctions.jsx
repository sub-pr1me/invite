import styles from '../styles/Auctions.module.css'

const Auctions = () => {
  return (
    <>
    <title>Auctions</title>
    <div className={`${styles.auctions_container}`}>
      <div>Active auctions</div>
      <div>Past auctions</div>
    </div>
    </>
  );
};

export default Auctions