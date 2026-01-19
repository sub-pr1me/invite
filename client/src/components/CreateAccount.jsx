import styles from '../styles/CreateAccount.module.css'
import { useState, useEffect } from 'react'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import AccTypeChoice from './AccTypeChoice'
import { useNavigate } from 'react-router-dom'

const CreateAccount = () => {

  const [result, setResult] = useState(null);

  const [accType, setAccType] = useState('venue');
  const { auth } = useAuth();
  const navigate = useNavigate();

  async function AddNewAcc(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const acc_type = formData.get('acc_type');

    try {

    const response = await axios.post("/create_account",
      { name: name, email: email, password: password, acc_type: acc_type },
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    );

    if (response.data === 'duplicate') setResult('duplicate');
    if (response.data === 'success') setResult('success');

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=> {
    if (result === 'success') setTimeout(() => { navigate('/acc_created')}, 0);
  });

  if (result === 'success') setTimeout(() => { navigate('/login')}, 2000);

  return (
    <div className={`${styles.container}`}>
        <AccTypeChoice
          accType={accType}
          setAccType={setAccType}
        />
        <div className={`${styles.duplicate} ${result !== 'duplicate' ? styles.hidden : null}`}>
          {`This e-mail address is already taken!`}
        </div>
        <form action={AddNewAcc}>
            <input required name='name' type="text" placeholder={accType === 'venue' ? 'Venue Name' : 'Customer Name'}/>
            <input required name='email' type="email" placeholder='Email'/>
            <input required name='password' type="password" placeholder='Password'/>
            <input required name='acc_type' type="text" value={accType} hidden readOnly/>
            <button>Submit</button>
        </form>
          <button className={`${!auth ? null : styles.hidden}`}
              onClick={() => {
                navigate('/');
              }}>Go Back
          </button>
    </div>
  )
}

export default CreateAccount