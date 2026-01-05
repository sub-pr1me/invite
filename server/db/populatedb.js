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
  pics TEXT[]
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer VARCHAR ( 255 ),
  email citext NOT NULL UNIQUE,
  password VARCHAR ( 255 ),
  pics TEXT[]
);

INSERT INTO venues (venue, email, password, pics) 
VALUES
  ('ALMAR Seafood Bar', 'almar@gmail.com', 'almar123', '{https://res.cloudinary.com/dn1vxf0hg/image/upload/v1765461914/almar_dgpueu.jpg}'),
  ('Elia Backyard Restaurant', 'elia@gmail.com', 'elia123', '{https://res.cloudinary.com/dn1vxf0hg/image/upload/v1765461914/elia_zhszb9.jpg}'),
  ('To Arxontikon Taverna', 'arxontikon@gmail.com', 'arxontikon123', '{https://res.cloudinary.com/dn1vxf0hg/image/upload/v1765461916/arxontikon_jgme5l.jpg}');
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