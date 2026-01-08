import { getAllVenueData } from "../db/queries.js"

export default async function listAllVenues(req, res) {
    const venues = await getAllVenueData();
    res.json(venues);
};