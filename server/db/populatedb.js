#!/usr/bin/env node
import { Client } from "pg";
import 'dotenv/config.js';

const SQL = `
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  venue VARCHAR ( 255 ) NOT NULL UNIQUE,
  email citext NOT NULL UNIQUE,
  password VARCHAR ( 255 ),
  stage VARCHAR ( 255 ),
  avatar VARCHAR ( 255 ),
  album TEXT[],
  likes TEXT[],
  rating NUMERIC (2,1),
  hours VARCHAR ( 255 ),
  tables JSONB,
  auctions JSONB,
  dates JSONB,
  credits NUMERIC (4,0),
  reftoken VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer VARCHAR ( 255 ),
  email citext NOT NULL UNIQUE,
  password VARCHAR ( 255 ),
  stage VARCHAR ( 255 ),
  avatar VARCHAR ( 255 ),
  album TEXT[],
  likes TEXT[],
  dob VARCHAR ( 255 ),
  age VARCHAR ( 255 ),
  gender VARCHAR ( 255 ),
  interest VARCHAR ( 255 ),
  dates JSONB,
  credits NUMERIC (4,0),
  reftoken VARCHAR ( 255 )
);

INSERT INTO venues (venue, email, password, stage, avatar, album, hours, tables, dates, credits)
VALUES
  ('ALMAR Seafood Bar', 
   'almar@gmail.com', 
   '$2b$10$kyqN3Zq1Pz8z8StirfeKG.3PZ0MXU79SjZq698XJYB269IpxFiSh2', 
   '3', 
   'https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772006953/vz2cuuvafuwv0qsk2ebe.jpg', 
   '{https://res.cloudinary.com/dn1vxf0hg/image/upload/v1778396671/ihro1t4fmsfuubtjrpak.png,
    https://res.cloudinary.com/dn1vxf0hg/image/upload/v1778396673/odhd2cycz25i87nijwql.png,
    https://res.cloudinary.com/dn1vxf0hg/image/upload/v1778396674/w9fe5i09hii5ozev5etq.png,
    https://res.cloudinary.com/dn1vxf0hg/image/upload/v1778396675/o8s96uewksoflkmsla0w.png,
    https://res.cloudinary.com/dn1vxf0hg/image/upload/v1778396677/unbhlh7fyi1jiq2p5vak.png}', 
   '10:00-22:00',
   '{"0": [{"id": 1, "pic": "https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772076148/pnfngy9zvshvqeoq0ccd.jpg", "modal": false, "active": true, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 2, "pic": "https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772076156/rnxwcjwz6qzbedpeoxej.jpg", "modal": false, "active": true, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 3, "pic": "https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772076167/ljkjpc2k6r57nxhvozg9.jpg", "modal": false, "active": true, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 4, "pic": "", "modal": false, "active": true, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 5, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 6, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 7, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 8, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 9, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 10, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 11, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 12, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 13, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 14, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 15, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 16, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 17, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 18, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 19, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}, 
    {"id": 20, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "bidders": [0,0,0], "reg": false, "venue_id": 1}}]}',
   '{}',
   '0'),

  ('Elia Backyard Restaurant', 
   'elia@gmail.com', 
   '$2b$10$WcdIqHK1zph72gBvNMmoGOwm2Y.Ri4ODe3Hrxhy.PEaRu4eHeAgLi', 
   '1', 
   'https://res.cloudinary.com/dn1vxf0hg/image/upload/v1769500654/ajbjnizwpbwq7jwrf65h.jpg', 
   '{}', 
   '10:00-22:00', 
   '{}',
   '{}',
   '0'),

  ('Savino Rock Bar', 
   'savino@gmail.com', 
   '$2b$10$3Aoe/BBUED1vBwqOf0ZCOunqIctEh7AD3UFYoq4JhdUPS9INGUCYe', 
   '1', 'https://res.cloudinary.com/dn1vxf0hg/image/upload/v1769501496/i3lre8meevjwwxez3rsp.jpg', 
   '{}', 
   '10:00-22:00', 
   '{}',
   '{}',
   '0')
   ON CONFLICT DO NOTHING;

  INSERT INTO customers (customer, email, password, stage, avatar, dob, gender, interest, dates, credits)
  VALUES
  ('Stan Marsh', 
   'stan@gmail.com', 
   '$2b$10$9fMzJPTDDSDAm71uSbew3u0gUyNcQ.DXW/8NoNvZ4OdjJcXZOMVW.', 
   '4',
   'https://res.cloudinary.com/dn1vxf0hg/image/upload/v1778840865/ihhpylmnf0mzybzm23zj.jpg', 
   '1988-07-29', 
   'Male', 
   'Female',
   '{}',
   '0')
   ON CONFLICT DO NOTHING;
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("db has been populated");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});