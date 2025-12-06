import { getAllVenueNames } from "../db/queries.js"

export default async function listAllVenues(req, res) {
    return await getAllVenueNames();
};