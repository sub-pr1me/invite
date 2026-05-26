import { checkConnection } from "../db/queries.js";

const handleCheckConnection = async (_, res) => {
  try {
    const result = await checkConnection();

    return res.status(200).json({
    status: 'Connected!',
    venues: result
  });

  } catch (err) {
    console.log(err);
    res.status(500).send('CONNECTION CONTROLLER ERROR');
  };
};

export default handleCheckConnection