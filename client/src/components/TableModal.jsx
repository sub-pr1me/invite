import styles from '../styles/TableModal.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useState, useEffect, useEffectEvent } from 'react'

const TableModal = ({ id, modal }) => {
  const [hidden, setHidden] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const showModal = useEffectEvent((modal)=>{
    if (modal) setHidden(false);
  });

  const hideModal = useEffectEvent((modal)=>{
    if (!modal) setTimeout(() => { setHidden(true) }, 310);
  });

  const removeTable = async () => {
    if (auth.tables.filter((item) => item.active === true).length > 1) {
      setHidden(true);
      const update = auth.tables;
      update.splice(id-1, 1, {'id': id, 'pic': '', 'active': false, 'modal': false, 'auction': false});
      try {
        await axiosPrivate.post("/info_upload",
          {hours: auth.hours, tables: update},
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
        );
        setAuth({...auth, tables: update});
      
      } catch (err) {
        if (!err?.response) {
          console.log('NO SERVER RESPONSE');
        } else {
          console.log('SOMETHING WENT WRONG');
        }
      }
    }
    
  };

  useEffect(()=>{    
    showModal(modal);
    hideModal(modal);
  },[modal]);

  return (
    <>
      <div className={`
        ${styles.container}
        ${styles[`m${id}`]}
        ${!modal ? styles.fade : null}
        ${hidden ? styles.hidden : null}`}>
        <button>Customize</button>
        <button>Auction</button>
        <button
          className={`${styles.red}`}
          onClick={()=>{removeTable()}}
          >Remove</button>
      </div>
    </>    
  )
}

export default TableModal