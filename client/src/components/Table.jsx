import styles from '../styles/Table.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Table = ({ id, active, modal, setStatus }) => {

  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const addTable = async () => {
    setStatus(`pending${id}`);
    const update = auth.tables.map(item => {return {...item, modal: false}});
    update.splice(id-1, 1, {'id': id, 'pic': '', 'active': true, 'modal': false, 'auction': false});
    try {
      await axiosPrivate.post("/info_upload",
        {hours: auth.hours, tables: update},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      setAuth({...auth, tables: update});
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
        ${modal ? styles.selected : null}`}
        onClick={()=>{!active ? addTable() : null}}>
        {
          active
          ? <div>{`Table ${id}`}</div>
          : <div className={`${styles.empty}`}>
            <img src='../../img/add.png' alt='' />
          </div>
        }
      </div>
    </>
  )
}

export default Table