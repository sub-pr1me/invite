import { getAllVenueData, getAllCustomerData } from "../db/queries.js"

export default async function listAllUsers(req, res) {
    const venues = await getAllVenueData();
    const customers = await getAllCustomerData();
    res.json({venues, customers});
};