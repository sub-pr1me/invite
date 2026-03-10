import styles from '../styles/AuctionsMonitor.module.css'
import AuctionActive from './AuctionActive'

const AuctionsMonitor = ({ section, setSection }) => {
  return (
    <>
    <div className={`${styles.monitor}`}>
        <div className={`${styles.navigate}`}>
          <div className={`${styles.current}`} onClick={()=>{setSection('current')}}>Current</div>
          <div className={`${styles.history}`} onClick={()=>{setSection('history')}}>History</div>
        </div>
        <div className={`${styles.line} ${section === 'current' ? styles.left : styles.right}`}></div>
        <div className={`${styles.sections} ${section !== 'current' ? styles.curr : styles.hist}`}>
          <div className={`${styles.history_section}`}>History</div>
          
          <div className={`${styles.current_section}`}>
            <AuctionActive />
            <AuctionActive />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionsMonitor