
export async function GetUserData(axiosPrivate, token, accType, userStatus) {

  if (userStatus === 'logged_in') {

    const response = await axiosPrivate.get(`/user`,
      {
        withCredentials: true,
        headers: { "authorization": "Bearer " + token },
        params: {accType}
      }
    );

    console.log('RESPONSE - ', response.data);    

    return await response.data;
  }
}