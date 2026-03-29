import styles from '../styles/Customer.module.css'

const Customer = ({ content }) => {
  return (
    <>
    <div className={`${styles.customer}`}>
      {!content ? <div>Empty<br />Seat</div> : 'HOST'}
    </div>
    </>
  );
};

export default Customer