import axios from 'axios';

export async function GetUserData(accType, userStatus, email) {

  if (userStatus === 'logged_in' && accType === 'venue') {
    console.log('START');

    const response = await axios.get(`http://localhost:3000/${accType}`,
      {email: email, accType: accType},
      {withCredentials: true}
    );

    console.log('FINISH');


    return await response.data;
  }
}