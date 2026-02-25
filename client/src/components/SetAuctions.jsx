import styles from '../styles/SetAuctions.module.css'
import useAuth from '../hooks/useAuth'
import Table from '../components/Table'
import TableModal from '../components/TableModal'
import TableLoading from '../components/TableLoading'
import TablePic from '../components/TablePic'
import { useState, useEffect, useEffectEvent } from 'react';
// import useAxiosPrivate from '../hooks/useAxiosPrivate'

const SetAuctions = () => {
  // const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const [active, setActive] = useState(auth.tables.filter((item) => item.active === true).length);
  const [auctions, SetAuctions] = useState(false);
  const [noteHidden, setNoteHidden] = useState(true);
  const [fadeNote, setFadeNote] = useState(true);
  const [status, setStatus] = useState('idle');
  const [customize, setCustomize] = useState(null);


  const CustomizeTable = (id) => {
    setCustomize(id);
  }

  const TablePicUpload = async () => {

  };

  const auctionsCount = useEffectEvent((auth)=>{
    const count = auth.tables.filter((item) => item.auctions);
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

  useEffect(()=>{
    auctionsCount(auth);
    if (status === 'success') activeCount(auth);
    resetStatus(status);    
  },[auth,status]);

  return (
    <>
    <div className={`${styles.container}`}>
      <div className={`${styles.info}`}>
        <div className={`${styles.instructions} ${customize ? styles.hidden : null}`}>
          You have {active} active {`table${active > 1 || active < 1? 's' : ''}`}. <br />
          {`${active > 1 || active < 1 ? 'These tables are' : 'This table is'}`} NOT visible to customers by default. <br /><br />

          In order to make a table visible to customers, you should <br />
          set up an auction for it. Do it by clicking on your table of choice <br />
          and choosing the "Auction" option. <br /><br />

          You can also customize or remove each table <br />
          by choosing a corresponding option in the same menu. <br /><br />

          Finally, if you want to add more tables to your venue, <br />
          you can do it by clicking on any empty slot.
        </div>   
        { customize &&
          <TablePic
            setCustomize={setCustomize}
            customize={customize}
          />
        }
      </div>
      <div className={`${styles.tables}`}>
        {
          auth.tables.map((item) =>(
            <div 
              key={item.id}
              className={`${styles.item} ${customize ? styles.unclickable : null}`}
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
                }
              }}>
                { status !== `pending${item.id}` &&
                  <TableModal
                    id={item.id}
                    modal={item.modal}
                    setStatus={setStatus}
                    CustomizeTable={CustomizeTable}
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
                  />
                }
                { status === `pending${item.id}` &&
                  <TableLoading/>
                }
            </div>              
          ))
        }
      </div>
      <div className={`${styles.btn_container}`}>
        <div className={`
          ${styles.note}
          ${fadeNote ? styles.fadeNote : null}
          ${noteHidden ? styles.hidden : null}`}>
            You must set at least one auction to continue!
        </div>
        <button
        disabled={!auctions}
        onMouseOver={()=>{
          setFadeNote(false);
          if (!auth.tables.filter((item) => item.auction).length) setNoteHidden(false);          
        }}
        onMouseOut={()=>{
          setFadeNote(true);
          if (!noteHidden) setTimeout(() => { setNoteHidden(true) }, 420);          
          }}>
          Save
      </button>
      </div>      
    </div>
    </>
  );
}

export default SetAuctions