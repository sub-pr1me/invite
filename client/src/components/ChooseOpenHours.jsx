import styles from '../styles/ChooseOpenHours.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const ChooseOpenHours = ({ state, setState }) => {

  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  async function Upload(formData) {
    
    const open = formData.get('open');
    const close = formData.get('closed');
    const hours = open + '-' + close;

    try {
      await axiosPrivate.post('/info_edit',
        {hours: hours, acc_type: 'venue'},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );

      setAuth({...auth, hours: hours});

    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else {
        console.log('SOMETHING WENT WRONG');
      }
    }
  };

  return (
    <>
      <form action={Upload} className={`${styles.form}`}>
        <div className={`${styles.time}`}>
          <div className={`${styles.open_time}`}>
            <label htmlFor='open'>Opens at:</label>
            <select name='open' id='open'>
              <option value='00:00'>00:00</option>
              <option value='01:00'>01:00</option>
              <option value='02:00'>02:00</option>
              <option value='03:00'>03:00</option>
              <option value='04:00'>04:00</option>
              <option value='05:00'>05:00</option>
              <option value='06:00'>06:00</option>
              <option value='07:00'>07:00</option>
              <option value='08:00'>08:00</option>
              <option value='09:00'>09:00</option>
              <option value='10:00'>10:00</option>
              <option value='11:00'>11:00</option>
              <option value='12:00'>12:00</option>
              <option value='13:00'>13:00</option>
              <option value='14:00'>14:00</option>
              <option value='15:00'>15:00</option>
              <option value='16:00'>16:00</option>
              <option value='17:00'>17:00</option>
              <option value='18:00'>18:00</option>
              <option value='19:00'>19:00</option>
              <option value='20:00'>20:00</option>
              <option value='21:00'>21:00</option>
              <option value='22:00'>22:00</option>
              <option value='23:00'>23:00</option>
            </select>
          </div>
          <div className={`${styles.closed_time}`}>
            <label htmlFor='closed'>Closes at:</label>
            <select name='closed' id='closed'>
              <option value='00:00'>00:00</option>
              <option value='01:00'>01:00</option>
              <option value='02:00'>02:00</option>
              <option value='03:00'>03:00</option>
              <option value='04:00'>04:00</option>
              <option value='05:00'>05:00</option>
              <option value='06:00'>06:00</option>
              <option value='07:00'>07:00</option>
              <option value='08:00'>08:00</option>
              <option value='09:00'>09:00</option>
              <option value='10:00'>10:00</option>
              <option value='11:00'>11:00</option>
              <option value='12:00'>12:00</option>
              <option value='13:00'>13:00</option>
              <option value='14:00'>14:00</option>
              <option value='15:00'>15:00</option>
              <option value='16:00'>16:00</option>
              <option value='17:00'>17:00</option>
              <option value='18:00'>18:00</option>
              <option value='19:00'>19:00</option>
              <option value='20:00'>20:00</option>
              <option value='21:00'>21:00</option>
              <option value='22:00'>22:00</option>
              <option value='23:00'>23:00</option>
            </select>
          </div>
        </div>
        <div>
          <button type='button' onClick={()=>{setState(!state)}}>Cancel</button>
          <button>Submit</button>
        </div>
      </form>
    </>
  );
};

export default ChooseOpenHours