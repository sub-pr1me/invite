import styles from '../styles/SetAucs.module.css'
import useAuth from '../hooks/useAuth'
import Table from './Table'
import TableModal from './TableModal'
import TableLoading from './TableLoading'
import TablePic from './TablePic'
import AuctionSetup from './AuctionSetup'
import { useState, useEffect, useEffectEvent } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { AuctionType, HostPreviewType, AuthType, TableType } from '../types'
import { AxiosError } from 'axios'

type SetAucsProps = { 
  setAuctions: React.Dispatch<React.SetStateAction<AuctionType[] | null>>;
  tablePreview: string | null;
  hostPreview: HostPreviewType;
}

const SetAucs = ({ setAuctions, tablePreview, hostPreview }: SetAucsProps) => {
  const axiosPrivate = useAxiosPrivate();  
  const { auth, setAuth, customize, setCustomize } = useAuth();
  const activeTables = auth?.tables?.filter((item) => item.active).length;
  const [active, setActive] = useState(activeTables ? activeTables : 0);
  const [auctionPool, setAuctionPool] = useState(false);
  const [noteHidden, setNoteHidden] = useState(true);
  const [fadeNote, setFadeNote] = useState(true);
  const [status, setStatus] = useState('idle');

  const auctionsCount = useEffectEvent((auth: AuthType)=>{
    const count = auth?.tables?.filter((item) => item.auction.deposit);
    if (count?.length) setAuctionPool(true);
    if (!count?.length) setAuctionPool(false);
  });

  const activeCount = useEffectEvent((auth: AuthType)=>{
    setActive(activeTables ? activeTables : 0);
  });

  const resetStatus = useEffectEvent((status: string)=>{
    if (status === 'success') setStatus('idle');
  });

  const EndVenueRegistration = async () => {
    const tables = auth?.tables?.map(item => {
      if (typeof item.auction === 'string') {
        return {...item, auction: JSON.parse(item.auction)}
      } else {return item}
    });
    
    const updated = tables?.map(item => {return {...item, auction: {...item.auction, reg: true}}});

    try {
      await axiosPrivate.post('/info_upload',
        {hours: auth?.hours, tables: JSON.stringify(updated), stage: auth?.stage, endreg: true},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      if (!auth) {throw new Error('Missing auth context')};
      setAuth({...auth, stage: '4'});

    } catch (err) {      
      const axiosError = err as AxiosError;      
      if (!axiosError?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG', axiosError.response.status);
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
    <div className={`${styles.container} ${auth?.stage === '4' ? styles.post_registration : null}`}>
      <div className={`${styles.info} ${auth?.stage === '4' || customize ? styles.hidden : null}`}>
        {auth?.stage !== '4' &&
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
          setStatus={setStatus}
        />
      }
      <div className={`${styles.tables}`}>
        {
          auth?.tables?.map((item) =>(
            <div 
              key={item.id}
              className={`
                ${styles.item} 
                ${customize || tablePreview || hostPreview ? styles.unclickable : null}`}
              onClick={()=>{
                if (item.active) {
                  setAuth({...auth,
                    tables: auth?.tables?.map(table => {
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
                    setAuctions={setAuctions}
                  />
                }
                { status !== `pending${item.id}` &&
                  <Table                
                    id={item.id}
                    active={item.active}
                    modal={item.modal}
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
        auth?.stage !== '4' &&
        <div className={`${styles.btn_container}`}
          onMouseEnter={()=>{
              setFadeNote(false);
              if (!auth?.tables?.filter((item) => item.auction.deposit).length) setNoteHidden(false);          
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
            disabled={!auctionPool}
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