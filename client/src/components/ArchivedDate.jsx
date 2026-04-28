import styles from '../styles/ArchivedDate.module.css'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

const ArchivedDate = ({ date, tablePreview, setTablePreview }) => {

  const { auth } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className={`${styles.date_container} ${tablePreview ? styles.preview_mode : null}`}>

      { tablePreview &&
        <div className={`${styles.table_preview} ${auth.roles[0] === 'customer' ? styles.alt : null}`}>
          <img src={date.table_pic} alt='' />
          <button onClick={()=>{setTablePreview(null)}}>Close</button>
        </div>
      }

        {auth. roles[0] === 'venue' &&
          <div className={`${styles.images}`}>

            <img src={date?.host_pic} alt='' onClick={()=>{navigate(`/dashboard/${date?.host_id}`)}}/>
            <img src={date?.guest_pic} alt='' onClick={()=>{navigate(`/dashboard/${date?.guest_id}`)}}/>
            <div className={styles.date_title}> {`Table ${date?.table}`} </div>

          </div>
        }

        {auth. roles[0] === 'customer' && !tablePreview &&
          <div className={`${styles.images}`}>

            {date?.table_pic 
              ? <img src={date?.table_pic} alt='' onClick={()=>{setTablePreview(true)}}/> 
              : <img className={`${styles.no_table}`} src='../../img/table.png' alt='' />
            }
            
            <img src={auth.email === date?.guest ? date?.host_pic : date?.guest_pic} alt=''
              onClick={()=>{
                auth.email === date?.guest 
                ? navigate(`/dashboard/${date?.host_id}`) 
                : navigate(`/dashboard/${date?.guest_id}`)
              }}
            />

            <Link to={`/dashboard/${date?.venue_id}`}>
              <div className={styles.date_title_customer}>{date?.venue_name}</div>
            </Link>

          </div>
        }
        <div className={styles.end_time}>{new Date(date.endTime).toUTCString()}</div>
        {auth.roles[0] === 'venue' && 
          <div className={styles.deposit}>{`Deposit: ${date.deposit}`}</div>
        }
      </div>
    </>
  );
};

export default ArchivedDate