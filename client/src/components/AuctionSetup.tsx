import styles from '../styles/AuctionSetup.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { AxiosError } from 'axios'
import { useRef, useEffect } from 'react'

type AuctionSetupProps = {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const AuctionSetup = ({ setStatus }: AuctionSetupProps) => {
  
  const { auth, setAuth, customize, setCustomize } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const depositRef = useRef<HTMLInputElement>(null);
  
  async function Upload(formData: FormData) {
  
  const deposit = Number(formData.get('deposit'));
  const step = Number(formData.get('step'));

  if (!Number.isFinite(deposit) || !Number.isFinite(step)) {return};

    try {
      await axiosPrivate.post('/auction_upload',
        {
          id: customize,
          deposit: deposit,
          step: step,
          bidders: JSON.stringify([null,null,null]),
          reg: auth?.stage !== '4' ? false : true,
          venue_id: auth?.id
        },
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );
      
      if (!auth) {throw new Error('Missing auth context')};
      const venueId = Number(auth?.id);
      if (!Number.isFinite(venueId)) {throw new Error('Invalid venue ID')};
      
      setAuth({
        ...auth, tables: auth?.tables?.map(
          table => {
            if (table.id === customize) {
              return {...table, 
                auction: {
                  deposit: deposit,
                  step: step,
                  bidders: [null,null,null],
                  reg: auth?.stage !== '4' ? false : true,
                  venue_id: venueId
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
          const axiosError = err as AxiosError;      
          if (!axiosError?.response) {
            console.log('NO SERVER RESPONSE');
          } else {
            console.log('SOMETHING WENT WRONG', axiosError.response.status);
          }
        }
  };

  useEffect(()=>{
    depositRef.current?.focus();
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
                max={1000}
                placeholder='50-1000'
                required/>
          </div>
          <div className={`${styles.step}`}>
            <label htmlFor='step'>Bid step:</label>
              <input
                type='number' 
                name='step' 
                id='step'
                min={10}
                max={200}
                placeholder='10-100'
                required/>
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