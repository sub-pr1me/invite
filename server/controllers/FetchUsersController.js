import { getAllVenueData, getAllCustomerData } from '../db/queries.js'

const handleFetchUsers = async (req, res) => {  
  const role = req.query.role;  
  try {
    if (role === 'venue') {

      const response = await getAllVenueData();
      response.map(item => item.dates = item.dates[0]);
      res.status(200).send(response);

    } else if (role === 'customer') {

      const response = await getAllCustomerData();
      response.map(item => item.dates = item.dates[0]);
      res.status(200).send(response);
    };

  } catch (err) {
    console.log(err);
    res.status(500).send('FETCH USER CONTROLLER ERROR');
  };
};

export default handleFetchUsers