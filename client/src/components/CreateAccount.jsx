import styles from '../styles/CreateAccount.module.css'
import axios from '../api/axios'

const CreateAccount = ({ accType, setAccType, userAction, setUserAction, userStatus,
                         setUserStatus, activeEmail, setActiveEmail, handleClick }) => {

  async function AddNewAcc(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const acc_type = formData.get('acc_type');
    setActiveEmail(email);

    const response = await axios.post("/create_account",
      {name: name, email: email, password: password, acc_type: acc_type},
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    );

    console.log(response.data);
    if (response.data === 'duplicate') {setUserStatus(response.data)};
    if (response.data === 'success') {
      setUserStatus('acc_created');
      setUserAction('sign_in');
    };
  };
  
  return (
    <div className={`${userAction !== 'create_acc' ? styles.hidden : null}
                     ${styles.container}`}>
        <div className={`${styles.duplicate} ${userStatus !== 'duplicate' ? styles.hidden : null}`}>
          {`Address "${activeEmail}" is already taken!`}
        </div>
        <form action={AddNewAcc}>
            <input required name='name' type="text" placeholder={accType === 'venue' ? 'Venue Name' : 'Customer Name'}/>
            <input required name='email' type="email" placeholder='Email'/>
            <input required name='password' type="password" placeholder='Password'/>
            <input required name='acc_type' type="text" value={accType} hidden readOnly/>
            <button>Submit</button>
        </form>
        <button className={`${!userAction ? styles.hidden : null}
        ${userStatus === 'acc_created' || userStatus === 'logged_out' ? null : styles.hidden}`}
          onClick={() => {
            handleClick('back');
            setUserStatus('logged_out')
            setActiveEmail(null);
            setAccType('venue');
            setUserAction(null);
          }}>Go Back
      </button>    
    </div>
  )
}

export default CreateAccount