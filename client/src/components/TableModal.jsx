import styles from '../styles/TableModal.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useState, useEffect, useEffectEvent } from 'react'

const TableModal = ({ id, modal, setStatus, CustomizeTable, setAuctions }) => {
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
      setStatus(`pending${id}`);
      setHidden(true);
      const update = auth.tables;
      update.splice(id-1, 1, {'id': id, 'pic': '', 'active': false, 'modal': false, 'auction': {deposit: null, step: null}});
      try {
        const response = await axiosPrivate.post("/info_upload",
          {hours: auth.hours, tables: JSON.stringify(update), stage: auth.stage},
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
        );
        if (response.data.tables[0]) { // deserialize data
          const arr = response.data.tables[0];
          const deserialized = [];
          for (let i=0; i<arr.length; i++) {
            if (arr[i].auction && arr[i].auction.deposit) {
              deserialized.push(
                {
                  id: parseInt(arr[i].id),
                  pic: `${arr[i].pic}`,
                  active: JSON.parse(arr[i].active),
                  modal: JSON.parse(arr[i].modal),
                  auction: {deposit: parseInt(arr[i].auction.deposit), step: parseInt(arr[i].auction.step)}
                }
              );
            } else if (arr[i].auction && !arr[i].auction.deposit) {
              deserialized.push(
                {
                  id: parseInt(arr[i].id),
                  pic: `${arr[i].pic}`,
                  active: JSON.parse(arr[i].active),
                  modal: JSON.parse(arr[i].modal),
                  auction: {deposit: null, step: null}
                }
              );
            } else {
              deserialized.push(
                {
                  id: parseInt(arr[i].id),
                  pic: `${arr[i].pic}`,
                  active: JSON.parse(arr[i].active),
                  modal: JSON.parse(arr[i].modal),
                  auction: {deposit: null, step: null}
                }
              );
            }
          };
          const auctions = await axiosPrivate.post("/auctions_update",
              {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                withCredentials: true
              }
          );
          setAuctions(auctions.data);
          setAuth({...auth, tables: deserialized});
          setTimeout(() => {setStatus('success');}, 500);
        };
      } catch (err) {
        console.error(err)
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
        <button onClick={()=>{CustomizeTable(id)}}>
          Photo
          </button>
        <button onClick={()=>{
          setStatus('auction');
          CustomizeTable(id);
          }}>
          Auction</button>
        <button
          className={`${styles.red}`}
          onClick={()=>{removeTable()}}
          >Remove</button>
      </div>
    </>    
  );
};

export default TableModal