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
  rating NUMERIC (2,1),
  reftoken VARCHAR ( 255 )
);

INSERT INTO venues (venue, email, password, stage, avatar)
VALUES
  ('ALMAR Seafood Bar', 'almar@gmail.com', '$2b$10$kyqN3Zq1Pz8z8StirfeKG.3PZ0MXU79SjZq698XJYB269IpxFiSh2', '1', 'https://res.cloudinary.com/dn1vxf0hg/image/upload/v1769500570/wumocsozmi7tpnm06flh.jpg'),
  ('Elia Backyard Restaurant', 'elia@gmail.com', '$2b$10$WcdIqHK1zph72gBvNMmoGOwm2Y.Ri4ODe3Hrxhy.PEaRu4eHeAgLi', '1', 'https://res.cloudinary.com/dn1vxf0hg/image/upload/v1769500654/ajbjnizwpbwq7jwrf65h.jpg'),
  ('Savino Rock Bar', 'savino@gmail.com', '$2b$10$3Aoe/BBUED1vBwqOf0ZCOunqIctEh7AD3UFYoq4JhdUPS9INGUCYe', '1', 'https://res.cloudinary.com/dn1vxf0hg/image/upload/v1769501496/i3lre8meevjwwxez3rsp.jpg');
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