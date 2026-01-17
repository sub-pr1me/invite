import { getLoggedInUserData } from "../db/queries.js";

export default async function getUserData(req, res) {
  const email = req.email;
  const { accType } = req.query;
  const response = await getLoggedInUserData(email, accType);
  res.send(response);
}