import { getAllVenueData, getAllCustomerData } from '../db/queries.js'

const handleFetchUsers = async (req, res) => {
  console.log('START');
  
  const role = req.query.role;

  console.log('ROLE - ',role);
  
  try {
    if (role === 'venue') {

      const response = await getAllVenueData();      
      res.status(200).send(response);

    } else if (role === 'customer') {

      const response = await getAllCustomerData();      
      res.status(200).send(response);
    };

  } catch (err) {
    console.log(err);
    res.status(500).send('FETCH PROFILE CONTROLLER ERROR');
  };
};

export default handleFetchUsers