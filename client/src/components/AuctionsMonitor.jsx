import styles from '../styles/AuctionsMonitor.module.css'
import AuctionActive from './AuctionActive'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useEffectEvent } from 'react'

const AuctionsMonitor = ({section, setSection, auctions, setAuctions}) => {

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const AuctionsUpdate = useEffectEvent(async () => {
    try {
      await axiosPrivate.post('/auctions_update',
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      
    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    };
  });

  const BroadcastAuctions = useEffectEvent(() => {
    try {
      const websocket = new WebSocket('ws://localhost:3000/ws');

      websocket.onopen = () => console.log('Connected to WebSocket server');
      websocket.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'auctions_updated') {
          const string = event.data;
          const auctionsData = JSON.parse(string);
          // console.log(auctionsData.data);
          setAuctions(auctionsData.data);
        }
      };
      websocket.onclose = () => console.log('Disconnected from WebSocket server');

      // Cleanup on unmount
      return () => websocket.close();

    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    };
  });

  useEffect(() => {
    AuctionsUpdate();
    BroadcastAuctions();    
  },[]);

  return (
    <>
    <div className={`${styles.monitor}`}>
        <div className={`
          ${styles.navigate}
          ${auth.roles[0] === 'customer' ? styles.navigate2 : null}`}>
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
        <div className={`
          ${styles.sections} 
          ${section !== 'current' ? styles.curr : styles.hist}
          ${auth.roles[0] === 'customer' ? styles.sections2 : null}`}>
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