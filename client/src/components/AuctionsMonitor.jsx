import styles from '../styles/AuctionsMonitor.module.css'
import AuctionActive from './AuctionActive'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuctionsMonitor = ({section, setSection, auctions, setAuctions,
  tablePreview, setTablePreview, hostPreview, setHostPreview}) => {

  const axiosPrivate = useAxiosPrivate();
  const [status, setStatus] = useState('idle');
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const AuctionsUpdate = useEffectEvent(async () => {
    try {
      const response = await axiosPrivate.post('/auctions_update',
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      const arr = response.data.filter(item => item.venue_email === auth.email);
      
      if (auth.roles[0] === 'venue') for (let i=0; i<arr.length; i++) {
        for (const table of auth.tables) {
          if (arr[i].id === table.id && arr[i].bidders[0].toString() !== table.auction.bidders[0].toString()) {
            setAuth({...auth, tables: auth.tables.map(table => {
              if (table.id) {
                return {...table, auction: {...table.auction, bidders: arr[i].bidders}};
              } else {return table};
            })});
          };
        }
      };
    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    };
  });

  const LikesUpdate = useEffectEvent(async ()=>{
    try {
      const response = await axiosPrivate.get('/fetch_profile_data',
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true,
          params: {
            role: 'customer',
            id: auth.id,
            from: 'AuctionsMonitor'
          }
        }
      );
      setAuth({...auth, likes: response.data.likes});
    } catch (err) {
      console.log(err);
    };
  });

  const BroadcastAuctions = useEffectEvent(() => {

    let attempt = 0;
    let maxAttempts = 5;
    
    const connect = () => {
      const websocket = new WebSocket('ws://localhost:3000/ws');

      websocket.onopen = () => {
        // console.log('Connected');
      }
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
        // console.log('Disconnected');
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

  const AcceptNewDate = async () => {

    setStatus('pending');
    const auctionToDelete = auctions.filter(
      item => item.venue_email === hostPreview.venue && item.id === hostPreview.auction_id
    )[0];

    const newDate = {
      venue: hostPreview.venue,
      venue_name: auctionToDelete.name,
      venue_id: `venue${auctionToDelete.venue_id}`,
      table: hostPreview.auction_id,
      table_pic: auctionToDelete.pic,
      host: hostPreview.email,
      host_id: hostPreview.id,
      host_pic: hostPreview.avatar,
      guest: auth.email,
      guest_id: `customer${auth.id}`,
      guest_pic: auth.avatar,
      deposit: hostPreview.bid,
      status: 'upcoming'
    };

    const refunds = auctionToDelete.bidders.filter(item => item && item.email !== hostPreview.email);
    try {
      await axiosPrivate.post('/new_date', // upload new date + remove the auction
          {
            venue: newDate.venue,
            host: newDate.host,
            guest: newDate.guest,
            new_date: newDate},
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
      );

      const venueDeposit = await axiosPrivate.post('/balance_update', // deposit to the venue
        {
          email: hostPreview.venue,
          amount: hostPreview.bid,
          acc_type: 'venue',
          deposit: true
        },
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      if (venueDeposit) {
        console.log(`${hostPreview.bid} bid was deposited to ${auctionToDelete.name}`);
      } else { 
        console.log(`Error depositing ${hostPreview.bid} bid to ${auctionToDelete.name}`);
      };

      while (refunds.length) {
        const customersRefunds = await axiosPrivate.post('/balance_update', // refund customers
          {
            email: refunds[0].email,
            amount: refunds[0].bid,
            acc_type: 'customer'},
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
        );
        if (customersRefunds) {
          console.log(`${refunds[0].bid} bid was refunded to ${refunds[0].name}`);
          refunds.shift();
        } else { 
          console.log(`Error refunding ${refunds[0].bid} bid to ${refunds[0].name}`);
          break;
        };
      };
      setStatus('success');
      setHostPreview(null);
    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      };
    };
  };



  const resetStatus = useEffectEvent(()=>{setStatus('idle')}); 

  useEffect(() => {
    AuctionsUpdate();
    BroadcastAuctions();
    LikesUpdate();
    if (status === 'success') resetStatus();
  },[status]);

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
            <img src={hostPreview.avatar} alt='' />
            <div className={`${styles.btns}`}>
              <button onClick={()=>{setHostPreview(null)}}>Close<br />Preview</button>
              <button onClick={()=>{navigate(`/dashboard/${hostPreview.id}`)}}>View<br />Profile</button>
              {auth.roles[0] !== 'venue'
               && auth.gender === hostPreview.interest
               && auth.likes.includes(hostPreview.email)
               &&
              <button onClick={()=>{AcceptNewDate()}}>Accept<br />Invitation!</button>
              }
            </div>
          </div>
        }
        <div className={`
          ${styles.navigate}
          ${auth.roles[0] === 'customer' ? styles.navigate2 : null}`}>
          <div 
            className={`${styles.current} ${section !== 'current' ? styles.non_highlighted : null}`} 
            onClick={()=>{setSection('current')}}
            >Live Auctions
          </div>
          <div 
            className={`${styles.history} ${section !== 'history' ? styles.non_highlighted : null}`} 
            onClick={()=>{setSection('history')}}
            >Dates History
          </div>
        </div>
        <div className={`${styles.line} ${section === 'current' ? styles.left : styles.right}`}></div>
        <div className={`
          ${styles.sections} 
          ${section !== 'current' ? styles.curr : styles.hist}
          ${auth.roles[0] === 'customer' ? styles.sections2 : null}`}>
          <div className={`${styles.history_section}`}>Dates History</div>
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
                    venue_id={item.venue_id}
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