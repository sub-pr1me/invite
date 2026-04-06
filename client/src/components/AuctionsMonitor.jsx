import styles from '../styles/AuctionsMonitor.module.css'
import AuctionActive from './AuctionActive'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useEffectEvent } from 'react'

const AuctionsMonitor = ({section, setSection, auctions, setAuctions,
  tablePreview, setTablePreview, hostPreview, setHostPreview}) => {

  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const AuctionsUpdate = useEffectEvent(async () => {
    try {
      const response = await axiosPrivate.post('/auctions_update',
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      const arr = response.data.filter(item => item.venue_email === auth.email);

      // console.log(arr[0].bidders);
      // console.log(arr[1].bidders);
      // console.log(arr[2].bidders);
      
      if (auth.roles[0] === 'venue') for (let i=0; i<arr.length; i++) {
        for (const table of auth.tables) {
          if (arr[i].id === table.id && arr[i].bidders[0].toString() !== table.auction.bidders[0].toString()) {
            console.log(`UPDATING TABLE ${table.id}`);
            setAuth({...auth, tables: auth.tables.map(table => {
              if (table.id) {
                return {...table, auction: {...table.auction, bidders: arr[i].bidders}};
              } else {return table}
            })});
          };
        }
      };
      // console.log('Auth', auth.tables[0].auction.bidders);
      // console.log('Auth', auth.tables[1].auction.bidders);
      // console.log('Auth', auth.tables[2].auction.bidders);
    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    };
  });

  const BroadcastAuctions = useEffectEvent(() => {

    let attempt = 0;
    let maxAttempts = 5;
    
    const connect = () => {
      const websocket = new WebSocket('ws://localhost:3000/ws');

      websocket.onopen = () => console.log('Connected');
      websocket.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'auctions_updated') {
          const string = event.data;
          const auctionsData = JSON.parse(string);
          // console.log(auctionsData.data);
          setAuctions(auctionsData.data);
        }
      };
      websocket.onclose = () => {
        console.log('Disconnected');
        reconnect();
      }

      // Cleanup on unmount
      return () => websocket.close();
    };

    const reconnect = () => {
      if (attempt >= maxAttempts) {
        console.error('Max reconnection attempts reached.');
        return;
      }
      setTimeout(() => {
        attempt++;
        connect();
      }, 1000 * attempt);
    };
    
    try {
      connect();

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
    // if (auth.roles[0] === 'venue') {
    //   console.log('Auth', auth.tables[0].auction.bidders);
    //   console.log('Auth', auth.tables[1].auction.bidders);
    //   console.log('Auth', auth.tables[2].auction.bidders);
    // }
  },[]);

  return (
    <>
    <div className={`${styles.monitor}`}>
        { tablePreview !== null &&
          <div className={`${styles.table_preview} ${auth.roles[0] === 'customer' ? styles.alt : null}`}>
            <img src={tablePreview} alt='' />
            <button onClick={()=>{setTablePreview(null)}}>Close</button>
          </div>
        }
        { hostPreview !== null &&
          <div className={`${styles.host_preview} ${auth.roles[0] === 'customer' ? styles.alt : null}`}>
            <img src={hostPreview} alt='' />
            <div className={`${styles.btns}`}>
              <button onClick={()=>{setHostPreview(null)}}>Close<br />Preview</button>
              <button onClick={()=>{console.log('Profile')}}>See<br />Profile</button>
              <button onClick={()=>{console.log('Accept')}}>Accept<br />Invitation</button>
            </div>
          </div>
        }
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
                if (item.reg !== 'false' && item.reg !== false) {
                  if (auth.roles[0] === 'venue' && item.name === auth.name
                      || auth.roles[0] === 'customer') return (
                  <AuctionActive
                    key={item.name+item.id}
                    id={item.id}
                    deposit={item.deposit}
                    step={item.step}
                    bidders={item.bidders}
                    venue_email={item.venue_email}
                    venue={item.name}
                    pic={item.pic}
                    setTablePreview={setTablePreview}
                    setHostPreview={setHostPreview}
                  />
                )
                }
              })
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionsMonitor