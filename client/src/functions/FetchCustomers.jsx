  import axios from '../services/axios';
  
  export async function fetchCustomers() {

    const response = await axios.get();
    return await response.data.customers;
  };