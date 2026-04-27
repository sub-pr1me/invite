import { ArchiveVenueDate, ArchiveHostDate, ArchiveGuestDate } from '../db/queries.js'

export default async function handleArchiveDate(req, res) {

  const response1 = await ArchiveVenueDate(req.body.venue, req.body.date);
  const response2 = await ArchiveHostDate(req.body.host, req.body.date);
  const response3 = await ArchiveGuestDate(req.body.guest, req.body.date);

  console.log('venue: ', response1);
  console.log('host: ', response2);
  console.log('guest: ', response3);

  res.status(200).send('DATE HAS BEEN ARCHIVED');
};