import { ArchiveVenueDate, ArchiveHostDate, ArchiveGuestDate } from '../db/queries.js'

export default async function handleArchiveDate(req, res) {

  const endTime = Date.now();

  await ArchiveVenueDate(req.body.venue, req.body.date, endTime);
  await ArchiveHostDate(req.body.host, req.body.date, endTime);
  await ArchiveGuestDate(req.body.guest, req.body.date, endTime);

  res.status(200).send(endTime);
};