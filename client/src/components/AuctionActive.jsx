import styles from '../styles/AuctionActive.module.css'
import Customer from './Customer'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useState, useEffect, useEffectEvent } from 'react'

const AuctionActive = ({ id, venue_email, venue, deposit, step, bidders, pic }) => {

  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [modal, setModal] = useState(null);
  const [fade, setFade] = useState(false);
  const [tableText, setTableText] = useState(`Table ${id}`);
  const [hover, setHover] = useState(false);
  const [status, setStatus] = useState('idle');
  const getRandomKey = () => crypto.randomUUID();

  const resetStatus = useEffectEvent(()=>{setStatus('idle')});

  const GetMinDeposit = () => {
  
    const arr = [];

    for (let i=0; i<bidders.length; i++) {    
      if (bidders[i] !== 0) arr.push(bidders[i]);
    };

    if (!arr[0]) return deposit;
    return arr[0].bid + step;
  };

  async function AddBid (formData) {
    setStatus('updating');

    const update = [];

    for (let i=0; i<bidders.length; i++) {      
      if (!bidders[i]) {
        update.push(0);      
      } else {        
        if (bidders[i].email !== auth.email) {
          update.push(bidders[i]);
        };        
      };
    };

    const bid = parseInt(formData.get('deposit'));
    const existingBid = bidders.filter(item => item.name === auth.name)[0]?.bid;
    
    let difference;
    
    if (existingBid) {
      difference = bid - existingBid;
    } else {
      difference = !bidders[0] ? bid : bid - bidders[0].bid;
    }

    if (difference <= auth.credits) {update.unshift({
          name: auth.name,
          email: auth.email,
          avatar: auth.avatar,
          bid: bid
        })
    } else {
      console.log('Insufficient Balance');
      return;
    };

    while (update.length > 3) update.pop();

    try {
      console.log('bid:', bid);
      console.log('difference:', difference);
      await axiosPrivate.post('/bidders_update',
        {bidders: JSON.stringify(update), venue_email: venue_email, table: id},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      await axiosPrivate.post('/auctions_update',
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      setStatus('success');
      setTimeout(() => {setModal(null)}, 250);
      setFade(true);
      const newBalance = await axiosPrivate.post('/balance_update',
        {
          amount: existingBid ? difference * -1 : bid * -1, 
          acc_type: auth.roles[0]
        },          
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      setAuth({...auth, credits: newBalance.data});
    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      };
    };
  };

  useEffect(()=>{
    if (status === 'success') resetStatus();
  },[bidders, status]);

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
            >{tableText}
          </div>
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
                  <label htmlFor='deposit'>Amount:</label>
                  <input 
                    type='number'
                    name='deposit'
                    id='deposit'
                    min={GetMinDeposit(bidders, deposit)}
                    placeholder={`Min: ${GetMinDeposit()}`}/>
                </div>              
                <div className={`${styles.btns}`}>
                  <button
                    type='button'
                    onClick={()=>{                       
                      setTimeout(() => {setModal(null)}, 250);
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
              key={item === 0 ? getRandomKey() : JSON.stringify(item)}
              content={item}
              modal={modal}/>
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