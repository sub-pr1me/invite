import styles from '../styles/AuctionActive.module.css'
import Customer from './Customer'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useState, useEffect, useEffectEvent } from 'react'
import { Link } from 'react-router-dom'
import { BidderType, HostPreviewType } from '../types'
import { AxiosError } from 'axios'

type AuctionActiveProps = { 
  id: number,
  venue_email: string,
  venue: string,
  venue_id: number,
  deposit: number,
  step: number,
  bidders: (BidderType | null)[],
  pic: string,
  setTablePreview: React.Dispatch<React.SetStateAction<string | null>>,
  setHostPreview: React.Dispatch<React.SetStateAction<HostPreviewType>>
}

const AuctionActive = ({ id, venue_email, venue, venue_id, deposit, step, bidders, 
  pic, setTablePreview, setHostPreview }:AuctionActiveProps) => {
    
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [modal, setModal] = useState<number | null>(null);
  const [fade, setFade] = useState(false);
  const [tableText, setTableText] = useState(`Table ${id}`);
  const [hover, setHover] = useState(false);
  const [status, setStatus] = useState('idle');
  const getRandomKey = () => crypto.randomUUID();

  const resetStatus = useEffectEvent(()=>{setStatus('idle')});

  const GetMinDeposit = (bidders: (BidderType | null)[], deposit: number) => {
  
    const arr = [];

    if (Array.isArray(bidders)) {
      for (let i=0; i<bidders.length; i++) {    
        if (bidders[i]) arr.push(bidders[i]);
      };
    };

    if (!arr[0]) return deposit;
    return arr[0].bid + step;
  };

  async function AddBid (formData: FormData) {
    setStatus('updating');

  const update: (BidderType | null)[] = [];
    
  for (const bidder of bidders) {
    if (bidder === null) {
      update.push(null);
    } else if (bidder.email !== auth?.email) {
      update.push(bidder);
    }
  }

    const depositValue = formData.get('deposit');
    if (typeof depositValue !== 'string' || depositValue.trim() === '') {
      throw new Error('Invalid deposit');
    };

    const bid = Number.parseInt(depositValue, 10);
    if (!Number.isFinite(bid)) {
      throw new Error('Invalid deposit');
    };

    const existingBid = bidders.filter(item => item?.name === auth?.name)[0]?.bid;
    
    let difference;
    let ejected = null;
    
    if (existingBid) {
      difference = bid - existingBid;
    } else {
      difference = !bidders[0] ? bid : bid - bidders[0].bid;
    }

    if (!auth) {throw new Error('Missing auth context')};    

    if (difference <= auth?.credits) {update.unshift({
          name: auth?.name,
          id: `${auth?.roles[0]}${auth?.id}`,
          avatar: auth?.avatar,
          interest: auth?.interest!,
          email: auth?.email,
          bid: bid
    });

    } else {
      console.log('Insufficient Balance');
      return;
    };

    if (update.length > 3) {ejected = update.pop()};

    try {
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
          email: auth?.email,
          amount: existingBid ? difference * -1 : bid * -1, 
          acc_type: auth?.roles[0]
        },          
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      if (ejected) {
        await axiosPrivate.post('/balance_update',
          {
            email: ejected.email,
            amount: ejected.bid, 
            acc_type: 'customer'
          },
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
        );
      };
      setAuth({...auth, credits: newBalance.data});
    } catch (err) {      
      const axiosError = err as AxiosError;      
      if (!axiosError?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG', axiosError.response.status);
      }
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
          auth?.roles[0] === 'customer' &&
          <Link to={`/dashboard/venue${venue_id}`}>
            <div 
              className={`${styles.venue_name} ${hover ? styles.highlight : null}`}
            >{venue}
            </div>
          </Link>
        }
        <div className={`${styles.table}`}>
          <div 
            className={`${styles.table_text} `}
            onMouseEnter={()=>{if (pic) {setTableText('View Photo')} else {setTableText('No Photo')}}}
            onMouseLeave={()=>{setTableText(`Table ${id}`)}}
            onClick={()=> {if (pic) {setTablePreview(pic)}}}
            >{tableText}
          </div>
          {pic && <img src={pic} alt=''/>}
        </div>
        <div className={`${styles.details} ${auth?.roles[0] === 'customer' ? styles.short : null}`}>          
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
                    placeholder={`Min: ${GetMinDeposit(bidders, deposit)}`}/>
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
              key={item === null ? getRandomKey() : JSON.stringify(item)}
              content={item}
              modal={modal}
              award={bidders.indexOf(item)}
              setHostPreview={setHostPreview}
              venue={venue_email}
              auction_id={id}
              />              
            )})
          }
        </div>
        {
          auth?.roles[0] === 'customer' &&
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