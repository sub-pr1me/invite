import styles from '../styles/AuctionSetup.module.css'

const AuctionSetup = ({ customize, setStatus, setCustomize }) => {
  return (
    <>
      <div className={styles.auction_container}>
        <div className={`${styles.header}`}><strong>Table {customize} <br />Auction Setup</strong></div>
        <form action=''>
          <div className={`${styles.date}`}>
            <label htmlFor='date'>Date:</label>
            <input
              type='date' 
              name='date' 
              id='date'/>
          </div>
          <div className={`${styles.start}`}>
            <label htmlFor='start'>Starts at:</label>
              <select name='start' id='start'>
                <option value='00:00'>00:00</option>
                <option value='01:00'>01:00</option>
                <option value='02:00'>02:00</option>
                <option value='03:00'>03:00</option>
                <option value='04:00'>04:00</option>
                <option value='05:00'>05:00</option>
                <option value='06:00'>06:00</option>
                <option value='07:00'>07:00</option>
                <option value='08:00'>08:00</option>
                <option value='09:00'>09:00</option>
                <option value='10:00'>10:00</option>
                <option value='11:00'>11:00</option>
                <option value='12:00'>12:00</option>
                <option value='13:00'>13:00</option>
                <option value='14:00'>14:00</option>
                <option value='15:00'>15:00</option>
                <option value='16:00'>16:00</option>
                <option value='17:00'>17:00</option>
                <option value='18:00'>18:00</option>
                <option value='19:00'>19:00</option>
                <option value='20:00'>20:00</option>
                <option value='21:00'>21:00</option>
                <option value='22:00'>22:00</option>
                <option value='23:00'>23:00</option>
              </select>
          </div>
          <div className={`${styles.end}`}>
            <label htmlFor='end'>Ends at:</label>
              <select name='end' id='end'>
                <option value='00:00'>00:00</option>
                <option value='01:00'>01:00</option>
                <option value='02:00'>02:00</option>
                <option value='03:00'>03:00</option>
                <option value='04:00'>04:00</option>
                <option value='05:00'>05:00</option>
                <option value='06:00'>06:00</option>
                <option value='07:00'>07:00</option>
                <option value='08:00'>08:00</option>
                <option value='09:00'>09:00</option>
                <option value='10:00'>10:00</option>
                <option value='11:00'>11:00</option>
                <option value='12:00'>12:00</option>
                <option value='13:00'>13:00</option>
                <option value='14:00'>14:00</option>
                <option value='15:00'>15:00</option>
                <option value='16:00'>16:00</option>
                <option value='17:00'>17:00</option>
                <option value='18:00'>18:00</option>
                <option value='19:00'>19:00</option>
                <option value='20:00'>20:00</option>
                <option value='21:00'>21:00</option>
                <option value='22:00'>22:00</option>
                <option value='23:00'>23:00</option>
              </select>
          </div>
          <div className={`${styles.deposit}`}>
            <label htmlFor='deposit'>Minimum deposit ($):</label>
              <input
                type='number' 
                name='deposit' 
                id='deposit'
                min={20}/>
          </div>
          <div className={`${styles.step}`}>
            <label htmlFor='step'>Auction bid step ($):</label>
              <input
                type='number' 
                name='step' 
                id='step'
                min={10}/>
          </div>
        </form>
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