import { NewDateUpload } from '../db/queries.js'

export default async function handleNewDate(req, res) {

  const response = await NewDateUpload(
    req.body.venue,
    req.body.host,
    req.body.guest,
    req.body.new_date
  );
  res.status(200).send(response);
};