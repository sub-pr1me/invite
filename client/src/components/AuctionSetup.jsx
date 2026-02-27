import styles from '../styles/AuctionSetup.module.css'

const AuctionSetup = ({ setStatus, setCustomize }) => {
  return (
    <>
      <div className={styles.container}>
        <div>DATE</div>
        <div>TIME</div>
        <div>ENDS BEFORE</div>
        <div>MIN DEPOSIT</div>
        <div>STEP</div>




        <div className={styles.btns}>
          <button onClick={()=>{
            setStatus('idle');
            setCustomize(null);
            }}>
            CANCEL
          </button>
        <button>SAVE</button>
        </div>
        
      </div>
    </>
  )
}

export default AuctionSetup