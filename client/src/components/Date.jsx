import styles from '../styles/Date.module.css'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

const Date = ({ date, amount, index, setIndex, tablePreview, setTablePreview }) => {
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

            <div 
              className={`${styles.prev} ${index === 0 ? styles.no_show : null}`} 
              onClick={()=>{if (index > 0) setIndex(index - 1)}}>
              <img src='../../img/arrow2.png' alt='' />
            </div>

            <img src={date.host_pic} alt='' onClick={()=>{navigate(`/dashboard/${date.host_id}`)}}/>
            <img src={date.guest_pic} alt='' onClick={()=>{navigate(`/dashboard/${date.guest_id}`)}}/>

            <div 
              className={`${styles.next} ${index === amount - 1 ? styles.no_show : null}`} 
              onClick={()=>{if (index + 1 < amount) setIndex(index + 1)}}>
              <img src='../../img/arrow2.png' alt='' />
            </div>

            <div className={styles.date_title}>{`Table ${date.table}`}</div>

          </div>
        }

        {auth. roles[0] === 'customer' && !tablePreview &&
          <div className={`${styles.images}`}>
            
            <div 
              className={`${styles.prev} ${index === 0 ? styles.no_show : null}`} 
              onClick={()=>{if (index > 0) setIndex(index - 1)}}>
              <img src='../../img/arrow2.png' alt='' />
            </div>

            {date.table_pic 
              ? <img src={date.table_pic} alt='' onClick={()=>{setTablePreview(true)}}/> 
              : <img className={`${styles.no_table}`} src='../../img/table.png' alt='' />
            }
            
            <img src={auth.email === date.guest ? date.host_pic : date.guest_pic} alt=''
              onClick={()=>{
                auth.email === date.guest ? navigate(`/dashboard/${date.host_id}`) : navigate(`/dashboard/${date.guest_id}`)
              }}
            />

            <div 
              className={`${styles.next} ${index === amount - 1 ? styles.no_show : null}`} 
              onClick={()=>{if (index + 1 < amount) setIndex(index + 1)}}>
              <img src='../../img/arrow2.png' alt='' />
            </div>

            <Link to={`/dashboard/${date.venue_id}`}>
              <div className={styles.date_title_customer}>{date.venue_name}</div>
            </Link>

          </div>
        }
      </div>
    </>
  );
};

export default Date