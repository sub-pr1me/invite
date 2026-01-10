import { getAllUserData } from "../db/queries.js";

export default async function VenueController(req, res) {
  const email = req.body.email;
  const accType = req.body.accType;
  const response = await getAllUserData(accType, email);
  console.log(response);
}