import styles from '../styles/SetAuctions.module.css'
import useAuth from '../hooks/useAuth'
import Table from '../components/Table'
import TableModal from '../components/TableModal'
import { useState, useEffect, useEffectEvent } from 'react';
// import useAxiosPrivate from '../hooks/useAxiosPrivate'

const SetAuctions = () => {
  // const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const [active, setActive] = useState(auth.tables.filter((item) => item.active === true).length);
  const [auctions, SetAuctions] = useState(false);
  const [noteHidden, setNoteHidden] = useState(true);
  const [fadeNote, setFadeNote] = useState(true);

  const auctionsCount = useEffectEvent((auth)=>{
    const count = auth.tables.filter((item) => item.auctions);
    if (count.length) SetAuctions(true);
    if (!count.length) SetAuctions(false);
  });

  const ShowModal = async (id) => {
    const updated = [];
    for (let i=0; i<auth.tables.length; i++) {
      if (auth.tables[i].id !== id) {
        if (auth.tables[i].modal) {
          updated.push(
          {
            id: auth.tables[i].id,
            pic: auth.tables[i].pic,
            modal: !auth.tables[i].modal,
            active: auth.tables[i].active,
            auction: auth.tables[i].auction
          }
        )
        } else {
          updated.push(auth.tables[i]);
        };        
      } else {
        updated.push(
          {
            id: auth.tables[i].id,
            pic: auth.tables[i].pic,
            modal: !auth.tables[i].modal,
            active: auth.tables[i].active,
            auction: auth.tables[i].auction
          }
        )
      }
    }
    setAuth(prev => {return {...prev, tables: updated}});
  };

  useEffect(()=>{
    auctionsCount(auth);
  },[auth]);

  return (
    <>
    <div className={`${styles.container}`}>
      <div className={`${styles.info}`}>
        <div className={`${styles.instructions}`}>
          You have {active} active {`table${active > 1 || active < 1? 's' : ''}`}. <br />
          {`${active > 1 || active < 1 ? 'These tables are' : 'This table is'}`} NOT visible to customers by default. <br /><br />

          In order to make a table visible to customers, you should <br />
          set up an auction for it. Do it by clicking on your table of choice <br />
          and going to the "Auction" section. <br /><br />

          You can also change each table's name <br />
          and upload its photo in the "Customize" section. <br /><br />

          Finally, if you want to add more tables to your venue, <br />
          you can do it by clicking on any empty slot.
        </div>
      </div>
      <div className={`${styles.tables}`}>
        { 
          auth.tables.map((item) =>(
            <div key={item.id} className={`${styles.item}`} onClick={()=>{if (item.active) ShowModal(item.id)}}>
              <TableModal
                  id={item.id}
                  modal={item.modal}
                />
              <Table                
                  id={item.id}
                  pic={item.pic}
                  active={item.active}
                  modal={item.modal}
                  auction={item.auction}
                />
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
  )
}

export default SetAuctions