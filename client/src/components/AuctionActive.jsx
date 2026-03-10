import styles from '../styles/AuctionActive.module.css'
import Customer from './Customer'

const AuctionActive = () => {
  return (
    <>
      <div className={`${styles.auction}`}>
          <div className={`${styles.table}`}>Table</div>
          <div className={`${styles.details}`}>
            <div className={`${styles.dep}`}>Dep: 100</div>
            <div className={`${styles.step}`}>Step: 20</div>
          </div>
          <div className={`${styles.bidders}`}>
            <Customer />
            <Customer />
            <Customer />
          </div>
          <div className={`${styles.new_bid}`}>
            +Bid
          </div>
      </div>
    </>
  );
};

export default AuctionActive