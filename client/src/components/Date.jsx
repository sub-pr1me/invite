import styles from '../styles/Date.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Date = ({ date, amount, index, setIndex, tablePreview, setTablePreview }) => {
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(true);
  const [end, setEnd] = useState(false);

  const ArchiveDate = async () => {
    try {
      const response = await axiosPrivate.post('/archive_date', 
        {
          venue: date.venue,
          host: date.host,
          guest: date.guest,
          date: date
        },
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      
      setAuth({...auth, dates: auth.dates.map(item => {
        if (JSON.stringify(item) === JSON.stringify(date)) {
          return {...item, status: 'archived', endTime: response.data}
        } else { return item };
      })});

      if (index > 0) setIndex(index-1);
    
    } catch (err) {
      console.log(err);
    };
  };

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

            <img className={`${styles.host_pic}`} src={date?.host_pic} alt='' onClick={()=>{navigate(`/dashboard/${date?.host_id}`)}}/>
            <img className={`${styles.guest_pic}`} src={date?.guest_pic} alt='' onClick={()=>{navigate(`/dashboard/${date?.guest_id}`)}}/>

            <div 
              className={`${styles.next} ${index === amount - 1 ? styles.no_show : null}`} 
              onClick={()=>{if (index + 1 < amount) setIndex(index + 1)}}>
              <img src='../../img/arrow2.png' alt='' />
            </div>

            <div className={`
              ${styles.end_date} 
              ${hidden ? styles.hidden : null}
              ${!end ? styles.fade : null}`} 
              onClick={()=>{
                ArchiveDate();
                setEnd(!end);
                if (hidden) {setHidden(false)} else {setTimeout(() => {setHidden(true)}, 300)} 
              }}> 
              End Date 
            </div>

            <div 
              className={styles.date_title}
              onClick={()=>{
                setEnd(!end);
                if (hidden) {setHidden(false)} else {setTimeout(() => {setHidden(true)}, 300)} 
              }}
              > {`Table ${date?.table}`} </div>

          </div>
        }

        {auth. roles[0] === 'customer' && !tablePreview &&
          <div className={`${styles.images}`}>
            
            <div 
              className={`${styles.prev} ${index === 0 ? styles.no_show : null}`} 
              onClick={()=>{if (index > 0) setIndex(index - 1)}}>
              <img src='../../img/arrow2.png' alt='' />
            </div>

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

            <div 
              className={`${styles.next} ${index === amount - 1 ? styles.no_show : null}`} 
              onClick={()=>{if (index + 1 < amount) setIndex(index + 1)}}>
              <img src='../../img/arrow2.png' alt='' />
            </div>

            <Link to={`/dashboard/${date?.venue_id}`}>
              <div className={styles.date_title_customer}>{date?.venue_name}</div>
            </Link>

          </div>
        }
      </div>
    </>
  );
};

export default Date