import styles from '../styles/Table.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { AxiosError } from 'axios';
import Thumb from './Thumb';
import { CustomizeType, TableType } from '../types'

type TableProps = { 
  id: number,
  active: boolean,
  modal: boolean,
  setStatus: React.Dispatch<React.SetStateAction<string>>,
  customize: CustomizeType,
  pic: string
}

const Table = ({ id, active, modal, setStatus, customize, pic }: TableProps) => {

  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const index = id-1;

  const addTable = async () => {
    setStatus(`pending${id}`);
    if (auth?.id === undefined) {throw new Error('Missing venue ID')};      
    const venueId = Number(auth.id);      
    if (Number.isNaN(venueId)) {throw new Error('Invalid venue ID')};
    let update: TableType[] | undefined;
    try {
      if (auth?.stage !== '4') {
        update = auth?.tables?.map((item: TableType) => {return {...item, modal: false}});        
        update?.splice(index, 1, 
          {
            'id': id, 
            'pic': '', 
            'active': true, 
            'modal': false, 
            'auction': {
              deposit: null, step: null, bidders: [0,0,0], reg: auth?.stage !== '4' ? false : true, venue_id: venueId
            }
          }
        );

        await axiosPrivate.post('/info_upload',
          {hours: auth?.hours, tables: JSON.stringify(update), stage: auth?.stage},
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
        );
        setAuth({...auth, tables: update});
      } else {
        const updated = await axiosPrivate.post('/transform_table',
          {id: id, active: true, venue_id: venueId},
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
        );
        setAuth({...auth, tables: updated?.data});
      };
      setTimeout(() => {setStatus('success');}, 500);
    
    } catch (err) {      
      const axiosError = err as AxiosError;      
      if (!axiosError?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG', axiosError.response.status);
      }
    }
};
const table = auth?.tables?.[index];
const deposit = table?.auction?.deposit;

  return (
    <>
      <div className={`
        ${styles.container} 
        ${styles[`t${id}`]} 
        ${active ? styles.active : styles.inactive}
        ${modal || customize === id ? styles.selected : null}
        ${deposit ? styles.auction_running : null}`}
        onClick={()=>{!active ? addTable() : null}}>
        {
          active
          ? <div className={`${styles.table_image}`}>
              <div className={`${styles.auction_icon} ${!deposit ? styles.hidden : null}`}>
                <img src='../../img/auctions.png' alt='' />
              </div>
              <div className={`${styles.bottom}`}>Table {id}</div>
              {pic && <Thumb src={pic} alt={'Table Image'}/>}
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