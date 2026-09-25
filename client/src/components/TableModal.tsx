import styles from '../styles/TableModal.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { AxiosError } from 'axios';
import { useState, useEffect, useEffectEvent } from 'react'
import { AuctionType, TableType } from '../types'

type TableModalProps = { 
  id: number, 
  modal: boolean, 
  setStatus: React.Dispatch<React.SetStateAction<string>>, 
  setAuctions: React.Dispatch<React.SetStateAction<AuctionType[] | null>>
}

const TableModal = ({ id, modal, setStatus, setAuctions }: TableModalProps) => {
  const [hidden, setHidden] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth, setCustomize } = useAuth();

  const showModal = useEffectEvent((modal: boolean)=>{
    if (modal) setHidden(false);
  });

  const hideModal = useEffectEvent((modal: boolean)=>{
    if (!modal) setTimeout(() => { setHidden(true) }, 250);
  });

  const removeTable = async () => {
    setStatus(`pending${id}`);
    if ((auth?.tables?.filter((item) => item.active === true).length ?? 0) >= 1) {      
      setHidden(true);
      if (auth?.id === undefined) {throw new Error('Missing venue ID')};      
      const venueId = Number(auth.id);      
      if (Number.isNaN(venueId)) {throw new Error('Invalid venue ID')};
      
      let update: TableType[] | undefined;

      try {
        if (auth?.stage !== '4') {
          update = auth?.tables;
          update?.splice(id-1, 1, {'id': id, 'pic': '', 'active': false, 'modal': false, 'auction': {
            deposit: null, step: null, bidders: [null,null,null], reg: auth?.stage !== '4' ? false : true, venue_id: venueId
          }});

          await axiosPrivate.post('/info_upload',
            {hours: auth?.hours, tables: JSON.stringify(update), stage: auth?.stage},
            {
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              withCredentials: true
            }
          );

          const auctions = await axiosPrivate.post('/auctions_update',
            {
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              withCredentials: true
            }
          );
          setAuctions(auctions.data);
          setAuth({...auth, tables: update});

        } else {
          const updated = await axiosPrivate.post('/transform_table',
            {id: id, active: false, venue_id: venueId},
            {
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              withCredentials: true
            }
          );
          
          const auctions = await axiosPrivate.post('/auctions_update',
            {
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              withCredentials: true
            }
          );
          
          setAuctions(auctions.data);
          setAuth({...auth, tables: updated?.data});
        };
        setTimeout(() => {setStatus('success')}, 250);

      } catch (err) {      
        const axiosError = err as AxiosError;      
        if (!axiosError?.response) {
          console.log('NO SERVER RESPONSE');
        } else {
          console.log('SOMETHING WENT WRONG', axiosError.response.status);
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
        <button onClick={()=>{setCustomize(id)}}>
          Photo
          </button>
        <button disabled={Boolean(auth?.tables?.[id-1]?.auction?.step)} onClick={()=>{
          setStatus('auction');
          setCustomize(id);
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