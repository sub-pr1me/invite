#! /usr/bin/env node
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
  rating NUMERIC (2,1),
  hours VARCHAR ( 255 ),
  tables JSONB,
  auctions JSONB,
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

INSERT INTO venues (venue, email, password, stage, avatar, album, hours, tables, credits)
VALUES
  ('ALMAR Seafood Bar', 
   'almar@gmail.com', 
   '$2b$10$kyqN3Zq1Pz8z8StirfeKG.3PZ0MXU79SjZq698XJYB269IpxFiSh2', 
   '3', 
   'https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772006953/vz2cuuvafuwv0qsk2ebe.jpg', 
   '{https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772073578/j1uizmmtupwrp70dm2ps.png,
     https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772073579/z164vgir8ieguxgctawe.png,
     https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772073575/sxlc79ztmajgrqewba4f.png,
     https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772073580/gpya3q9tieuoh6we4ien.png,
     https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772073581/ekw2tiofukalgtxbmhqm.png}', 
   '10:00-22:00',
   '{"0": [{"id": 1, "pic": "https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772076148/pnfngy9zvshvqeoq0ccd.jpg", "modal": false, "active": true, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 2, "pic": "https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772076156/rnxwcjwz6qzbedpeoxej.jpg", "modal": false, "active": true, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 3, "pic": "https://res.cloudinary.com/dn1vxf0hg/image/upload/v1772076167/ljkjpc2k6r57nxhvozg9.jpg", "modal": false, "active": true, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 4, "pic": "", "modal": false, "active": true, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 5, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 6, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 7, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 8, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 9, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 10, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 11, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 12, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 13, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 14, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 15, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 16, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 17, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 18, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 19, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}, 
    {"id": 20, "pic": "", "modal": false, "active": false, "auction": {"deposit": null, "step": null, "reg": false}}]}',
   '0'),

  ('Elia Backyard Restaurant', 
   'elia@gmail.com', 
   '$2b$10$WcdIqHK1zph72gBvNMmoGOwm2Y.Ri4ODe3Hrxhy.PEaRu4eHeAgLi', 
   '1', 
   'https://res.cloudinary.com/dn1vxf0hg/image/upload/v1769500654/ajbjnizwpbwq7jwrf65h.jpg', 
   '{}', 
   '', 
   '{}', 
   '0'),

  ('Savino Rock Bar', 
   'savino@gmail.com', 
   '$2b$10$3Aoe/BBUED1vBwqOf0ZCOunqIctEh7AD3UFYoq4JhdUPS9INGUCYe', 
   '1', 'https://res.cloudinary.com/dn1vxf0hg/image/upload/v1769501496/i3lre8meevjwwxez3rsp.jpg', 
   '{}', 
   '', 
   '{}', 
   '0');

  INSERT INTO customers (customer, email, password, stage, avatar, dob, gender, interest, credits)
  VALUES
  ('Stan Marsh', 
   'stan@gmail.com', 
   '$2b$10$9fMzJPTDDSDAm71uSbew3u0gUyNcQ.DXW/8NoNvZ4OdjJcXZOMVW.', 
   '4', 'https://res.cloudinary.com/dn1vxf0hg/image/upload/v1774449173/jpzdy6bnnimvlhfcuvpq.jpg', 
   '2026-03-03', 
   'Male', 
   'Female',
   '0');
`;



async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("db has been populated");
};

main();