import { getVenueData } from "../db/queries.js";

export default async function VenueController(req, res) {
  const email = req.email;
  const response = await getVenueData(email);
  res.send(response);
}