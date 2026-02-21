import styles from '../styles/TableModal.module.css'
import { useState, useEffect, useEffectEvent } from 'react'

const TableModal = ({ id, modal }) => {
  const [hidden, setHidden] = useState(true);

  const showModal = useEffectEvent((modal)=>{
    if (modal) setHidden(false);
  });

  const hideModal = useEffectEvent((modal)=>{
    if (!modal) setTimeout(() => { setHidden(true) }, 310);
  });  

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
      </div>
    </>    
  )
}

export default TableModal