import styles from '../styles/InfoUpload.module.css'
import { } from 'react'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const InfoUpload = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  async function Upload(formData) {
    const open = formData.get('open');
    const close = formData.get('closed');
    console.log(open, '-', close);
  };

  return (
    <>
    {
      auth.roles[0] === 'venue'
      ?
      <div className={`${styles.venue}`}>
        <div>Now, please specify your venue's working hours <br /> and how many tables it has.</div>
        <form action={Upload}>
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
          <div>TABLES</div>
        </form>
      </div>
      :
      <div className={`${styles.customer}`}>CUSTOMER INFO UPLOAD</div>
    }
    </>
  )
}

export default InfoUpload