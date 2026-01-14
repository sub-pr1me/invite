
export async function GetUserData(axiosPrivate, token, accType, userStatus) {

  if (userStatus === 'logged_in') {

    const response = await axiosPrivate.get(`/${accType}`,
      {
        withCredentials: true,
        headers: { "authorization": "Bearer " + token }
      }
    );
    
    console.log('RESPONSE - ', response.data);    

    return await response.data;
  }
}