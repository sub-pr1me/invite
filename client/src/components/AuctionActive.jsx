import styles from '../styles/AuctionActive.module.css'
import Customer from './Customer'
import useAuth from '../hooks/useAuth'

const AuctionActive = ({ id, venue, deposit, step, pic }) => {

  const { auth } = useAuth();

  return (
    <>
      <div className={`${styles.auction}`}>
        {
          auth.roles[0] === 'customer' &&
          <div className={`${styles.venue_name}`}>{venue}</div>
        }
        <div className={`${styles.table}`}>
          <div>Table {id}</div>
          {pic && <img src={pic} alt=''/>}
        </div>
        <div className={`${styles.details} ${auth.roles[0] === 'customer' ? styles.short : null}`}>          
          <div className={`${styles.dep}`}>Dep: {deposit}</div>
          <div className={`${styles.step}`}>Step: {step}</div>
        </div>
        <div className={`${styles.bidders}`}>
          <Customer />
          <Customer />
          <Customer />
        </div>
        { 
          auth.roles[0] === 'customer' &&
          <div className={`${styles.new_bid}`}>
            +Bid
          </div>
        }          
      </div>
    </>
  );
};

export default AuctionActive