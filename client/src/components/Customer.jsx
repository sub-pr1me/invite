import { useState } from 'react';
import styles from '../styles/Customer.module.css'

const Customer = ({ content, modal, award, setHostPreview }) => {

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
        onClick={()=> {if (content.avatar) {setHostPreview({
          avatar: content.avatar, 
          id: content.id,
          interest: content.interest,
          email: content.email})}}}
        >{text}
      </div>
      }
      {
      !content 
      ? <div className={`${styles.empty}`}>Empty<br />Seat</div> 
      : <img className={`${styles.avatar}`}src={`${content.avatar}`} alt='' /> }
      {content !==0 &&
        <div className={`${styles.bid} ${modal ? styles.fade : null}`}>
          {content ? content.bid : null}
        </div>
      }
    </div>
    </>
  );
};

export default Customer