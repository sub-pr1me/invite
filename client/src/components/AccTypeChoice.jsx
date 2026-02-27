import styles from '../styles/AccTypeChoice.module.css'

const AccTypeChoice = ({ accType, setAccType }) => {
  return (
    <div className={`${styles.content}`}>
      <h3>Choose your account type:</h3>
      <div className={`${styles.acc_type}`}>
        <div onClick={() => {setAccType('customer')}}
             className={`${styles.type_customer} ${accType === 'customer' ? styles.selected : null}`}>
          <img src="../../img/human.svg" alt="CUSTOMER" />
          <h4>Customer</h4>
        </div>
        <div onClick={() => {setAccType('venue')}}
             className={`${styles.type_venue} ${accType === 'venue' ? styles.selected : null}`}>
          <img src="../../img/home.svg" alt="VENUE" />
          <h4>Venue</h4>
        </div>
      </div>
    </div>
  )
}

export default AccTypeChoice