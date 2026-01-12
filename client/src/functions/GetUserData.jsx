
export async function GetUserData(axiosPrivate, token, accType, userStatus) {

  if (userStatus === 'logged_in' && accType === 'venue') {

    const response = await axiosPrivate.get(`/venue`,
      {
        withCredentials: true,
        headers: { "authorization": "Bearer " + token }
      }
    );
    
    console.log('RESPONSE - ', response.data);
    

    return await response.data;
  }
}