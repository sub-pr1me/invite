import styles from '../styles/Cashier.module.css'

const Cashier = () => {
  return (
    <>
    <title>Cashier</title>
    <div className={`${styles.cashier_container}`}>
      <div>Balance</div>
      <div>Buy credits (customer)</div>
      <div>Cash out credits (venue)</div>
    </div>
    </>
  );
};

export default Cashier