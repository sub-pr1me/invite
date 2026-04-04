import styles from '../styles/SetAucs.module.css'
import useAuth from '../hooks/useAuth'
import Table from './Table'
import TableModal from './TableModal'
import TableLoading from './TableLoading'
import TablePic from './TablePic'
import AuctionSetup from './AuctionSetup'
import { useState, useEffect, useEffectEvent } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const SetAucs = ({ setAuctions, tablePreview }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth, customize, setCustomize } = useAuth();
  const [active, setActive] = useState(auth.tables.filter((item) => item.active === true).length);
  const [auctions, SetAuctions] = useState(false);
  const [noteHidden, setNoteHidden] = useState(true);
  const [fadeNote, setFadeNote] = useState(true);
  const [status, setStatus] = useState('idle');

  const CustomizeTable = (id) => {
    setCustomize(id);
  }

  const auctionsCount = useEffectEvent((auth)=>{
    const count = auth.tables.filter((item) => item.auction.deposit);
    if (count.length) SetAuctions(true);
    if (!count.length) SetAuctions(false);
  });

  const activeCount = useEffectEvent((auth)=>{
    const count = auth.tables.filter((item) => item.active).length;
    setActive(count);
  });

  const resetStatus = useEffectEvent((status)=>{
    if (status === 'success') setStatus('idle');
  });

  const EndVenueRegistration = async () => {
    const tables = auth.tables.map(item => {
      if (typeof item.auction === 'string') {
        return {...item, auction: JSON.parse(item.auction)}
      } else {return item}});
    tables.map((item) => item.auction.reg = true);
    try {
      await axiosPrivate.post("/info_upload",
        {hours: auth.hours, tables: JSON.stringify(tables), stage: auth.stage, endreg: true},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      setAuth({...auth, stage: '4'});

    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    }
  };

  useEffect(()=>{
    auctionsCount(auth);
    if (status === 'success') activeCount(auth);
    resetStatus(status);
  },[auth,status]);

  return (
    <>
    <div className={`${styles.container} ${auth.stage === '4' ? styles.post_registration : null}`}>
      <div className={`${styles.info} ${auth.stage === '4' || customize ? styles.hidden : null}`}>
        {auth.stage !== '4' &&
        <div className={`${styles.instructions} ${customize ? styles.hidden : null}`}>
          You have {active} active {`table${active > 1 || active < 1? 's' : ''}`}. <br />
          {`${active > 1 || active < 1 ? 'These tables are' : 'This table is'}`} NOT visible to customers by default. <br /><br />

          In order to make a table visible, you should set up<br />
          an auction for it. Do it by clicking on your table of choice <br />
          and choosing the "Auction" option. <br /><br />

          You can also remove tables or upload their photos <br />
          by choosing corresponding options in the same menu. <br /><br />

          Finally, if you want to add more tables to your venue, <br />
          you can do it by clicking on any empty slot.
        </div>
        }
      </div>
      { customize && status !== 'auction' &&
        <TablePic
          customize={customize}
          setCustomize={setCustomize}            
        />
      }
      { customize && status === 'auction' &&
        <AuctionSetup
          customize={customize}
          setStatus={setStatus}  
          setCustomize={setCustomize}
        />
      }
      <div className={`${styles.tables}`}>
        {
          auth.tables.map((item) =>(
            <div 
              key={item.id}
              className={`${styles.item} ${customize || tablePreview ? styles.unclickable : null}`}
              onClick={()=>{
                if (item.active) {
                  setAuth({...auth,
                    tables: auth.tables.map(table => {
                      if (table.id === item.id) {
                        return {...table, modal: !item.modal};
                      } else {
                        return {...table, modal: false};
                      }
                    })
                  });
                };
              }}>
                { status !== `pending${item.id}` &&
                  <TableModal
                    id={item.id}
                    modal={item.modal}
                    setStatus={setStatus}
                    CustomizeTable={CustomizeTable}
                    setAuctions={setAuctions}
                  />
                }
                { status !== `pending${item.id}` &&
                  <Table                
                    id={item.id}
                    active={item.active}
                    modal={item.modal}
                    status={status}
                    setStatus={setStatus}
                    customize={customize}
                    pic={item.pic}
                  />
                }
                { status === `pending${item.id}` &&
                  <TableLoading/>
                }
            </div>              
          ))
        }
      </div>
      {
        auth.stage !== '4' &&
        <div className={`${styles.btn_container}`}
          onMouseEnter={()=>{
              setFadeNote(false);
              if (!auth.tables.filter((item) => item.auction.deposit).length) setNoteHidden(false);          
            }}
            onMouseLeave={()=>{
              setFadeNote(true);
              if (!noteHidden) setTimeout(() => { setNoteHidden(true) }, 420);          
            }}>
          <div className={`
            ${styles.note}
            ${fadeNote ? styles.fadeNote : null}
            ${noteHidden ? styles.hidden : null}`}>
              You must set at least one auction to continue!
          </div>          
          <button
            disabled={!auctions}
            onClick={()=>{EndVenueRegistration()}}>
            Save
          </button>          
        </div>
      }
    </div>
    </>
  );
};

export default SetAucs