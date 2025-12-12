  import axios from 'axios';
  
  export async function fetchVenues() {
    
    const delay = new Promise((resolve) => setTimeout(resolve, 500));
    await delay; // half second delay simulation

    const response = await axios.get("http://localhost:3000");
    return response.data.venues;
  };