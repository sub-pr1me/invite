import styles from '../styles/Customer.module.css'
import useAuth from '../hooks/useAuth'
import { useState } from 'react';

const Customer = ({ content, modal, award, setHostPreview, venue, auction_id }) => {
  const { auth } = useAuth();
  const [text, setText] = useState('');
  const medals = ['../../img/gold.png','../../img/silver.png','../../img/bronze.png'];

  return (
    <>
    <div className={`${styles.customer}`}>
      {content !==0 &&
        <div className={`${styles.medal}`}>
          <img src={`${medals[award]}`} alt='' />
        </div>
      }
      {content !==0 &&
        <div 
        className={`${styles.slot_text}`}
        onMouseEnter={()=>{setText('View Options')}}
        onMouseLeave={()=>{setText('')}}
        onClick={()=> {if (content.avatar) {
          console.log('CONTENT:',content);
          setHostPreview({
          avatar: content.avatar, 
          id: content.id,
          interest: content.interest,
          email: content.email,
          bid: content.bid,
          venue: venue,
          auction_id: auction_id})}}}
        >{text}
      </div>
      }
      {
      !content 
      ? <div className={`${styles.empty}`}>Empty<br />Seat</div> 
      : <img className={`${styles.avatar}`}src={`${content.avatar}`} alt='' /> }
      {content !==0 &&
        <div className={`
          ${styles.bid} 
          ${auth.likes?.includes(content.email) 
            && auth.roles[0] === 'customer' 
            ? styles.green 
            : null} 
          ${modal ? styles.fade : null}`
        }>
          {content ? content.bid : null}
        </div>
      }
    </div>
    </>
  );
};

export default Customer