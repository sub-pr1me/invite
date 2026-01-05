import pool from "./pool.js";

export async function getAllVenueData() {
  const { rows } = await pool.query("SELECT * FROM venues");
  
  for (let i=0; i<rows.length; i++) {
    delete rows[i].email;
    delete rows[i].password;
  };
  
  return rows;
};

export async function checkVenuesForMatch(email) {
  const { rows } = await pool.query(`SELECT * FROM venues WHERE email LIKE '${email}'`);
  return rows[0];
};

export async function checkCustomersForMatch(email) {
  const { rows } = await pool.query(`SELECT * FROM customers WHERE email LIKE '${email}'`);
  return rows[0];
};

export async function createNewUser(acc_type, name, email, password) {
  await pool.query(`INSERT INTO ${acc_type}s (${acc_type}, email, password) VALUES ($1, $2, $3)`, [name, email, password]);
  return 'success';
};

export async function getUserData(email, acc_type) {
  const { rows } = await pool.query(`SELECT ${acc_type}, password FROM ${acc_type}s WHERE email LIKE '${email}'`);
  return rows[0];
};

// export async function searchUsername(string) {
//   const { rows } = await pool.query(`SELECT * FROM usernames WHERE username LIKE '%${string}%'`);
//   return rows;
// };

// export async function deleteAllUsernames() {
//   const { rows } = await pool.query("DELETE FROM usernames");
//   return rows;
// };