import styles from '../styles/AuctionActive.module.css'
import Customer from './Customer'
import useAuth from '../hooks/useAuth'
import { useState } from 'react'

const AuctionActive = ({ id, venue, deposit, step, bidders, pic }) => {

  const { auth } = useAuth();
  const getRandomKey = () => crypto.randomUUID();
  const [modal, setModal] = useState(null);
  const [fade, setFade] = useState(false);
  const [tableText, setTableText] = useState(`Table ${id}`);
  const [hover, setHover] = useState(false);

  const AddBid = () => {
    console.log(id);
  };

  return (
    <>
      <div
        className={`${styles.auction}`}
        onMouseEnter={()=>{setHover(true)}}
        onMouseLeave={()=>{setHover(false)}}>        
        {
          auth.roles[0] === 'customer' &&
          <div className={`${styles.venue_name} ${hover ? styles.highlight : null}`}>{venue}</div>
        }
        <div className={`${styles.table}`}>
          <div 
            className={`${styles.table_text} `}
            onMouseEnter={()=>{if (pic) {setTableText('See Photo')} else {setTableText('No Photo')}}}
            onMouseLeave={()=>{setTableText(`Table ${id}`)}}
            >{tableText}</div>
          {pic && <img src={pic} alt=''/>}
        </div>
        <div className={`${styles.details} ${auth.roles[0] === 'customer' ? styles.short : null}`}>          
          <div className={`${styles.dep}`}>Dep: <div>{deposit}</div></div>
          <div className={`${styles.step}`}>Step: <div>{step}</div></div>
        </div>
        <div className={`${styles.bidders}`}>
          {modal &&
            <div className={`${styles.modal} ${fade ? styles.fade : null}`}>
              <form action={AddBid}>
                <div>
                  <label>Amount:</label>
                  <input 
                    type='number'
                    placeholder={`Min: ${deposit}`}/>
                </div>              
                <div className={`${styles.btns}`}>
                  <button
                    type='button'
                    onClick={()=>{                       
                      setTimeout(() => {setModal(null)}, 310);
                      setFade(true);
                    }}>Cancel</button>
                  <button>Submit</button>
                </div>  
              </form>                  
            </div>
          }
          {
            bidders.map((item) => {
            return(
            <Customer 
              key={getRandomKey()}
              content={parseInt(item)}/>
            )})
          }          
        </div>
        {
          auth.roles[0] === 'customer' &&
          <div 
            className={`${styles.new_bid}`}
            onClick={()=>{
              setFade(false);
              setModal(id);
            }}>
            +Bid
          </div>
        }          
      </div>
    </>
  );
};

export default AuctionActive