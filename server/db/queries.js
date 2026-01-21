import pool from "./pool.js";

export async function getAllVenueData() {
  const { rows } = await pool.query("SELECT * FROM venues");
  
  for (let i=0; i<rows.length; i++) {
    delete rows[i].email;
    delete rows[i].password;
    const album = rows[i].pics;
    const profilePic = album.shift();
    rows[i].profilePic = profilePic;
    rows[i].album = album;
    delete rows[i].pics;
  };
  
  return rows;
};

export async function getAllCustomerData() {
  const { rows } = await pool.query("SELECT * FROM customers");
  
  for (let i=0; i<rows.length; i++) {
    delete rows[i].email;
    delete rows[i].password;
    const album = rows[i].pics;
    const profilePic = album.shift();
    rows[i].profilePic = profilePic;
    rows[i].album = album;
    delete rows[i].pics;
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

export async function createNewUser(acc_type, name, email, password, stage) {
  await pool.query(`INSERT INTO ${acc_type}s (${acc_type}, email, password, stage) VALUES ($1, $2, $3, $4)`, [name, email, password, stage]);
  return 'success';
};

export async function getUserData(email, acc_type) {
  const { rows } = await pool.query(`SELECT ${acc_type}, password, pics, stage FROM ${acc_type}s WHERE email LIKE '${email}'`);
  return rows[0];
};

export async function addRefreshToken(acc_type, email, token) {
  await pool.query(`UPDATE ${acc_type}s SET refToken = '${token}' WHERE email = '${email}'`);
  return 'success';
};

export async function checkVenueToken(token) {
  const { rows } = await pool.query(`SELECT * FROM venues WHERE reftoken LIKE '${token}'`);
  return rows[0];
};

export async function checkCustomerToken(token) {
  const { rows } = await pool.query(`SELECT * FROM customers WHERE reftoken LIKE '${token}'`);
  return rows[0];
};

export async function deleteRefreshToken(acc_type, email) {
  await pool.query(`UPDATE ${acc_type}s SET refToken = '' WHERE email = '${email}'`);
  return 'success';
};

export async function getLoggedInUserData(email, acc_type) {
  const { rows } = await pool.query(`SELECT id, email, pics, ${acc_type} FROM ${acc_type}s WHERE email LIKE '${email}'`);
  return await rows[0];
};