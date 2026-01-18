import styles from '../styles/AccTypeChoice.module.css'

const AccTypeChoice = ({ accType, setAccType }) => {
  return (
    <div>
      <h2>Choose your account type:</h2>
      <div className={`${styles.acc_type}`}>
        <div onClick={() => {setAccType('customer')}}
             className={`${styles.type_container} ${accType === 'customer' ? styles.selected : null}`}>
          <img src="../../img/human.svg" alt="CUSTOMER" />
          <h3>Customer</h3>
        </div>
        <div onClick={() => {setAccType('venue')}}
             className={`${styles.type_container} ${accType === 'venue' ? styles.selected : null}`}>
          <img src="../../img/home.svg" alt="VENUE" />
          <h3>Venue</h3>
        </div>
      </div>
    </div>
  )
}

export default AccTypeChoice