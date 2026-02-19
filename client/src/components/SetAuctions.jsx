import styles from '../styles/SetAuctions.module.css'
import useAuth from '../hooks/useAuth'
import Table from '../components/Table'
// import useAxiosPrivate from '../hooks/useAxiosPrivate'

const SetAuctions = () => {
  // const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  let active = 0;

  const TableCount = () => {
    for (let i=0; i<auth.tables.length; i++) {
      if (auth.tables[i].active) active++;
    }
  };
  TableCount();

return (
  <>
  <div className={`${styles.container}`}>
    <div className={`${styles.info}`}>
      <div className={`${styles.instructions}`}>
        You have {active} active {`table${active > 1 ? 's' : ''}`}. <br />
        {`${active > 1 ? 'These tables are' : 'This table is'}`} NOT visible for customers by default. <br /><br />
        In order to make a table visible for customers, <br />
        you should set up an auction for it. <br /><br />

        Do it by clicking on your table of choice <br />
        and going to the "Auction" section. <br /><br />

        You can also change the name of each table <br />
        and upload it's photo in the "Customize" section.
      </div>
    </div>
    <div className={`${styles.tables}`}>
      {
        auth.tables.map((item) =>(
            <Table
              key={item.id}
              id={item.id}
              pic={item.pic}
              active={item.active}
              auction={item.auction}
            />     
        ))
      }
    </div>
    <button>Save</button>
  </div>
  </>
)
}

export default SetAuctions