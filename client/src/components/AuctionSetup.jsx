import styles from '../styles/AuctionSetup.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useRef, useEffect } from 'react';

const AuctionSetup = ({ customize, setStatus, setCustomize }) => {
  
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const depositRef = useRef();
  
  async function Upload(formData) {

    try {
      await axiosPrivate.post("/auction_upload",
        {id: customize, deposit: formData.get('deposit'), step: formData.get('step'), reg: auth.stage !== '4' ? false : true},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      setAuth({
        ...auth, tables: auth.tables.map(
          table => {
            if (table.id === customize) {
              return {...table, 
                auction: {
                  deposit: formData.get('deposit'),
                  step: formData.get('step'),
                  reg: auth.stage !== '4' ? false : true
                }
              };
            } else {
              return table;
            }
          }
        )
      });
      setStatus('idle');
      setCustomize(null);

    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    }
  };

  useEffect(()=>{
    depositRef.current.focus();
  },[]);

  return (
    <>
      <div className={styles.auction_container}>
        <div className={`${styles.header}`}><strong>Table {customize}</strong></div>
          <div className={`${styles.description}`}>
            First, set the minimum amount of credits <br />
            a customer has to deposit in order to participate.
            <br /><br />
            Then, set the bid step, which is the minimum amount <br />
            by which a new bid must exceed the previous one. 
          </div>
        <form action={Upload}>
          <div className={`${styles.fields}`}>
            <div className={`${styles.deposit}`}>
            <label htmlFor='deposit'>Minimum deposit:</label>
              <input
                type='number' 
                name='deposit'
                id='deposit'
                ref={depositRef}
                min={50}
                max={1000}/>
          </div>
          <div className={`${styles.step}`}>
            <label htmlFor='step'>Bid step:</label>
              <input
                type='number' 
                name='step' 
                id='step'
                min={10}
                max={200}/>
          </div>
          </div>
          <div className={styles.btns}>
            <button 
              type='button'
              onClick={()=>{
              setStatus('idle');
              setCustomize(null);
              }}>
              Cancel
            </button>
            <button>Save</button>
          </div>  
        </form>      
      </div>
    </>
  );
};

export default AuctionSetup