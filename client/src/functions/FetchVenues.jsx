  import axios from '../api/axios';
  
  export async function fetchVenues() {

    const accType = "venue";
    
    const delay = new Promise((resolve) => setTimeout(resolve, 500));
    await delay; // half second delay simulation

    const response = await axios.get('', { params: {accType} });
    return await response.data.venues;
  };