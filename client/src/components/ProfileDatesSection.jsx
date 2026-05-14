import styles from '../styles/ProfileDatesSection.module.css'
import useAuth from '../hooks/useAuth'
import { useState } from 'react';
import Date from './Date';

const ProfileDatesSection = ({ dates, tablePreview, setTablePreview }) => {
  const { auth } = useAuth();
  const [index, setIndex] = useState(0);
  const amount = dates?.length;

  return (
    <>
      <div className={`
        ${styles.dates_container}
        ${!auth.likes?.length && auth.roles[0] === 'venue' ? styles.shifted : null}`}>
        {!tablePreview && <div className={styles.background}></div>}
          { !tablePreview &&
            <div className={styles.title}>
            You have <div className={styles.amount}>{amount}</div> 
            upcoming {`date${amount > 1 || amount < 1? 's' : ''}`}:
          </div>
          }
          <div className={`${styles.dates_content}`}>
            <Date 
              date={dates[index]} 
              amount={amount}
              index={index}
              setIndex={setIndex}
              tablePreview={tablePreview}
              setTablePreview={setTablePreview}
              />
          </div>
      </div>
    </>
  );
};

export default ProfileDatesSection