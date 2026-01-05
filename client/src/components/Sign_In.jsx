import React from 'react'
import styles from '../styles/Sign_In.module.css'
import axios from 'axios'
import { use } from 'react'

const Sign_In = ({ messagePromise, userAction, userStatus, setUserStatus }) => {

  if (userStatus === 'acc_created') {
    const delay = use(messagePromise);
    console.log(delay);
    setUserStatus('logged_out');
  }

  async function LogIn(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await axios.post("http://localhost:3000/sign_in",
        {email: email, password: password},
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true,
        }
      );

      console.log(response);
      // const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;

    } catch (err) {
      if (!err?.response) {
        console.log('NO SERVER RESPONSE');
      } else if (err.response?.status === 400) {
        console.log('MISSING EMAIL OR PASSWORD');
      } else if (err.response?.status === 401) {
        console.log('UNAUTHORIZED');
      } else {
        console.log('LOGIN FAILED');
      }
    }    
  };
  
  return (
    <div className={`${userAction !== 'sign_in' ? styles.hidden : null}
                     ${styles.container}`}>
      <h2>Log In:</h2>
      <form action={LogIn}>
        <input name='email' type="email" placeholder='Email'/>
        <input name='password' type="password" placeholder='Password'/>
        <button>Submit</button>
      </form>
    </div>
  )
}

export default Sign_In