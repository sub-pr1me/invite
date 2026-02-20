import styles from '../styles/SetAuctions.module.css'
import useAuth from '../hooks/useAuth'
import Table from '../components/Table'
import { useState, useEffect, useEffectEvent } from 'react';
// import useAxiosPrivate from '../hooks/useAxiosPrivate'

const SetAuctions = () => {
  // const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [active, setActive] = useState(0);

  const CountActive = useEffectEvent(async()=>{
    setActive(auth.tables.filter((item) => item.active === true).length);
  });

  useEffect(()=> {
    // console.log('TABLES - ', auth.tables);
    // console.log('LENGTH - ', auth.tables.filter((item) => item.active));
    if(active === 0) CountActive();
  },[active, auth.tables])


  return (
    <>
    <div className={`${styles.container}`}>
      <div className={`${styles.info}`}>
        <div className={`${styles.instructions}`}>
          You have {active} active {`table${active > 1 || active < 1? 's' : ''}`}. <br />
          {`${active > 1 || active < 1 ? 'These tables are' : 'This table is'}`} NOT visible for customers by default. <br /><br />

          In order to make a table visible for customers, you should <br />
          set up an auction for it. Do it by clicking on your table of choice <br />
          and going to the "Auction" section. <br /><br />

          You can also change the name of each table <br />
          and upload it's photo in the "Customize" section. <br /><br />

          Finally, if you want to add more tables to your venue, <br />
          you can do it by clicking on any empty slot.
        </div>
      </div>
      <div className={`${styles.tables}`}>
        { auth.tables.filter((item) => item.active === true).length
          ?
          auth.tables.map((item) =>(
              <Table
                key={item.id}
                id={item.id}
                pic={item.pic}
                active={item.active}
                auction={item.auction}
              />     
          ))
          :
          ''
        }
      </div>
      <button>Save</button>
    </div>
    </>
  )
}

export default SetAuctions