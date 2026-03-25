import styles from '../styles/InfoUpload.module.css'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const InfoUpload = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  async function Upload(formData) {
    
    const open = formData.get('open');
    const close = formData.get('closed');
    const hours = open + '-' + close;
    const tables = formData.get('tables');
    const dob = formData.get('dob');
    const gender = formData.get('gender');
    const interest = formData.get('interest');
    const tables_arr = [];
    const maxTables = 20;

    if (auth.roles[0] === 'venue') {
      for (let i = 1; i <= tables; i++) { // add active tables
        tables_arr.push({'id': i, 'pic': '', 'active': true, 'modal': false, 'auction': {deposit: null, step: null}});
      };

      for (let i = parseInt(tables)+1; i <= maxTables; i++) { // add inactive tables
        tables_arr.push({'id': i, 'pic': '', 'active': false, 'modal': false, 'auction': {deposit: null, step: null}});
      };
    }

    try {
      await axiosPrivate.post("/info_upload",
        {hours: hours, tables: tables_arr, stage: auth.stage, dob: dob, gender: gender, interest: interest},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
      );

      if (auth.stage === '2' && auth.roles[0] === 'venue') setAuth({...auth, stage: '3', tables: tables_arr});


      if (auth.stage === '2' && auth.roles[0] === 'customer') setAuth({...auth, stage: '4'});

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
          <div className={`${styles.table}`}>
            <label htmlFor='tables'>Number of tables (1-20):</label>
            <input
              name='tables'
              id='tables'
              type="number"
              min='1'
              max='20'
              placeholder='#'
              required 
            />
          </div>
          <button>Save</button>
        </form>
      </div>
      :
      <div className={`${styles.customer}`}>
        <div>Now, please specify a few details about yourself.</div>
        <form action={Upload}>
            <div className={`${styles.birthday}`}>
              <label htmlFor='dob'>Date of birth:</label>
              <input
                type='date' 
                name='dob' 
                id='dob'/>
            </div>
            <div className={`${styles.gender}`}>
              <label htmlFor='gender'>Gender:</label>
              <select name='gender' id='gender'>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </select>
            </div>
            <div className={`${styles.interest}`}>
              <label htmlFor='interest'>Looking for:</label>
              <select name='interest' id='interest'>
                <option value='Female'>Female</option>
                <option value='Male'>Male</option>                
              </select>
            </div>
          <button>Save</button>
        </form>
      </div>
    }
    </>
  );
};

export default InfoUpload