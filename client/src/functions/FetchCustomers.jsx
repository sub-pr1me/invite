  import axios from '../api/axios';
  
  export async function fetchCustomers() {

    const response = await axios.get();
    return await response.data.customers;
  };