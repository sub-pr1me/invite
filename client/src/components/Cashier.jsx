import styles from '../styles/Cashier.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useEffectEvent } from 'react'

const Cashier = ({ setActive }) => {
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const UpdateBalance = async (formData) => {

    const amount = formData.get('amount');

    try {
      const response = await axiosPrivate.post('/balance_update',
        {
          email: auth.email,
          amount: amount,
          acc_type: auth.roles[0]},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      setAuth({...auth, credits: response.data});
    } catch (err) {
      console.log(err);
    };
  };

  const onRefresh = useEffectEvent(()=>{setActive('cashier')});
  
  useEffect(()=>{
    onRefresh();
  },[]);

  return (
    <>
    <title>Cashier</title>
    <div className={`${styles.cashier_container}`}>
      <div className={`${styles.balance}`}>
        <div>{auth.credits}</div>
        <div>Balance</div>
      </div>
      {
        auth.roles[0] === 'customer' && 
        <div className={`${styles.deposit}`}>
          <form action={UpdateBalance}>
            <label htmlFor='amount'>Amount:</label>
            <input
              name='amount'
              id='amount'
              type="number"
              min='50'
              max={9999 - auth.credits}
              placeholder={`50-${9999-auth.credits}`}
              required 
            />
            <button>Deposit</button>
          </form>
        </div>
      }
      {
        auth.roles[0] === 'venue' && 
        <div className={`${styles.cashout}`}>
          <form action={UpdateBalance}>
            <label htmlFor='amount'>Amount:</label>
            <input
              name='amount'
              id='amount'
              type="number"
              min='10'
              max={auth.credits}
              placeholder={`10-${auth.credits}`}
              required 
            />
            <button>Cash Out</button>
          </form>
        </div>
      }
    </div>
    </>
  );
};

export default Cashier