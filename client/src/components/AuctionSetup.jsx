import styles from '../styles/AuctionSetup.module.css'

const AuctionSetup = ({ setStatus, setCustomize }) => {
  return (
    <>
      <div className={styles.container}>
        AUCTION SETUP
        <button onClick={()=>{
          setStatus('idle');
          setCustomize(null);
        }}>
        CANCEL
        </button>
      </div>
    </>
  )
}

export default AuctionSetup