import styles from '../styles/AuctionsMonitor.module.css'
import AuctionActive from './AuctionActive'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useState, useEffect, useEffectEvent } from "react"

const AuctionsMonitor = ({section, setSection}) => {

  const axiosPrivate = useAxiosPrivate();
  const [auctions, setAuctions] = useState(null);
  

  const AuctionsUpdate = useEffectEvent(async () => {
    if (!auctions) {
      try {
        const response = await axiosPrivate.post("/auctions_update",
          {auctions: auctions},
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
        );

        if (auctions !== response.data) setAuctions(response.data);

      } catch (err) {
        if (!err?.response) {
          console.log('NO SERVER RESPONSE');
        } else {
          console.log('SOMETHING WENT WRONG');
        }
      }
    }
  });

  useEffect(() => {
    AuctionsUpdate();
        
    // const eventSource = new EventSource(`http://localhost:3000/auctions?token=${auth.token}`);

    // eventSource.onmessage = (event) => {
    //   setAuctions(event.data);
    //   console.log('EVENT DATA -', event.data);
    // };

    // eventSource.onerror = (error) => {
    //   console.error("EventSource failed:", error);
    //   eventSource.close();
    // };

    // console.log('AUCTIONS -', auctions);

    // return () => {
    //   eventSource.close();
    // };
  },[]);

  return (
    <>
    <div className={`${styles.monitor}`}>
        <div className={`${styles.navigate}`}>
          <div 
            className={`${styles.current} ${section !== 'current' ? styles.non_highlighted : null}`} 
            onClick={()=>{setSection('current')}}
            >Current
          </div>
          <div 
            className={`${styles.history} ${section !== 'history' ? styles.non_highlighted : null}`} 
            onClick={()=>{setSection('history')}}
            >History
          </div>
        </div>
        <div className={`${styles.line} ${section === 'current' ? styles.left : styles.right}`}></div>
        <div className={`${styles.sections} ${section !== 'current' ? styles.curr : styles.hist}`}>
          <div className={`${styles.history_section}`}>History</div>          
          <div className={`${styles.current_section}`}>
            { auctions &&
              auctions.map((item) => {
                return (
                  <AuctionActive
                    key={item.name+item.id}
                    id={item.id}
                    deposit={item.deposit}
                    step={item.step}
                    venue={item.name}
                    pic={item.pic}
                    auctions={auctions}
                    setAuctions={setAuctions}
                  />
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionsMonitor