import styles from '../styles/Customer.module.css'
import useAuth from '../hooks/useAuth'
import { useState } from 'react';
import { HostPreviewType, BidderType} from '../types'

type CustomerProps = { 
  content: BidderType | null,
  modal: number | null, 
  award: number, 
  setHostPreview: React.Dispatch<React.SetStateAction<HostPreviewType | null>>, 
  venue:string, 
  auction_id:number
}

const Customer = ({ content, modal, award, setHostPreview, venue, auction_id }: CustomerProps) => {
  const { auth } = useAuth();
  const [text, setText] = useState('');
  const medals = ['../../img/gold.png','../../img/silver.png','../../img/bronze.png'];

  return (
    <>
    <div className={`${styles.customer}`}>
      {content !== null &&
        <div className={`${styles.medal}`}>
          <img src={`${medals[award]}`} alt='' />
        </div>
      }
      {content !== null &&
        <div 
        className={`${styles.slot_text}`}
        onMouseEnter={()=>{setText('View Options')}}
        onMouseLeave={()=>{setText('')}}
        onClick={()=> {if (content?.avatar) {
          // console.log('CONTENT:',content);
          setHostPreview({
          avatar: content?.avatar, 
          id: content?.id,
          interest: content?.interest,
          email: content?.email,
          bid: content?.bid,
          venue: venue,
          auction_id: auction_id})}}}
        >{text}
      </div>
      }
      {
      !content 
      ? <div className={`${styles.empty}`}>Empty<br />Seat</div> 
      : <img className={`${styles.avatar}`}src={`${content?.avatar}`} alt='' /> }
      {content !== null &&
        <div className={`
          ${styles.bid} 
          ${auth?.likes?.some((like) => like[0] === content?.email) 
            && auth?.roles[0] === 'customer' 
            ? styles.green 
            : null} 
          ${modal ? styles.fade : null}`
        }>
          {content ? content?.bid : null}
        </div>
      }
    </div>
    </>
  );
};

export default Customer