import pool from "./pool.js";

export async function getAllVenueNames() {
  const { rows } = await pool.query("SELECT * FROM venues");
  return rows;
};

// export async function insertUsername(username) {
//   await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
// };

// export async function searchUsername(string) {
//   const { rows } = await pool.query(`SELECT * FROM usernames WHERE username LIKE '%${string}%'`);
//   return rows;
// };

// export async function deleteAllUsernames() {
//   const { rows } = await pool.query("DELETE FROM usernames");
//   return rows;
// };