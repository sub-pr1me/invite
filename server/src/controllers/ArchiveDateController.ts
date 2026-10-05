import { ArchiveVenueDate, ArchiveHostDate, ArchiveGuestDate } from '../models/queries.js'
import type { Request, Response } from 'express'

export default async function handleArchiveDate(req: Request, res: Response) {

  const endTime = Date.now();

  await ArchiveVenueDate(req.body.venue, req.body.date, endTime);
  await ArchiveHostDate(req.body.host, req.body.date, endTime);
  await ArchiveGuestDate(req.body.guest, req.body.date, endTime);

  res.status(200).send(endTime);
};