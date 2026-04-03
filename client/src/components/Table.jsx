import styles from '../styles/Table.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Table = ({ id, active, modal, setStatus, customize, pic }) => {

  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const index = id-1;

  const addTable = async () => {
    setStatus(`pending${id}`);
    let update;
    try {
      if (auth.stage !== '4') {

        update = auth.tables.map(item => {return {...item, modal: false}});
        update.splice(index, 1, {'id': id, 'pic': '', 'active': true, 'modal': false, 'auction': {
          deposit: null, step: null, bidders: [0,0,0], reg: auth.stage !== '4' ? false : true
        }});

        await axiosPrivate.post('/info_upload',
          {hours: auth.hours, tables: JSON.stringify(update), stage: auth.stage},
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
        );
        setAuth({...auth, tables: update});
      } else {
        update = await axiosPrivate.post('/transform_table',
          {id: id, active: true},
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
        );
        setAuth({...auth, tables: update.data});        
      };
      setTimeout(() => {setStatus('success');}, 500);
    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    }
  };

  return (
    <>
      <div className={`
        ${styles.container} 
        ${styles[`t${id}`]} 
        ${active ? styles.active : styles.inactive}
        ${modal || customize === id ? styles.selected : null}
        ${auth.tables[index].auction.deposit ? styles.auction_running : null}`}
        onClick={()=>{!active ? addTable() : null}}>
        {
          active
          ? <div className={`${styles.table_image}`}>
              <div className={`${styles.auction_icon} ${!auth.tables[index].auction.deposit ? styles.hidden : null}`}>
                <img src='../../img/auctions.png' alt='' />
              </div>
              <div className={`${styles.bottom}`}>Table {id}</div>
              <img src={pic ? pic : null} alt='' className={`${!pic ? styles.hidden : null}`}/>
            </div>
          : <div className={`${styles.empty}`}>
            <img src='../../img/add.png' alt='' />
          </div>
        }
      </div>
    </>
  );
};

export default Table