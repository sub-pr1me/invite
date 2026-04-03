import styles from '../styles/Customer.module.css'

const Customer = ({ content, modal }) => {

  return (
    <>
    <div className={`${styles.customer}`}>
      {
      !content 
      ? <div className={`${styles.empty}`}>Empty<br />Seat</div> 
      : <img src={`${content.avatar}`} alt='' /> }
      {content !==0 &&
        <div className={`${styles.bid} ${modal ? styles.fade : null}`}>{content ? content.bid : null}</div>
      }
    </div>
    </>
  );
};

export default Customer