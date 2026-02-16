import pool from "./pool.js";

export async function getAllVenueData() {
  const { rows } = await pool.query("SELECT * FROM venues");
  
  for (let i=0; i<rows.length; i++) {
    delete rows[i].email;
    delete rows[i].password;
  };
  
  return rows;
};

export async function getAllCustomerData() {
  const { rows } = await pool.query("SELECT * FROM customers");
  
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

export async function createNewUser(acc_type, name, email, password, stage, rating) {
  if (acc_type === 'venue') {
    await pool.query(
      `INSERT INTO venues (
      venue, email, password, stage, rating) 
      VALUES ($1, $2, $3, $4, $5)`, 
      [name, email, password, stage, rating]);
    return 'success';
  };
  await pool.query(
    `INSERT INTO customers (
    customer, email, password, stage) 
    VALUES ($1, $2, $3, $4)`, 
    [name, email, password, stage]);
  return 'success';
};

export async function getUserData(email, acc_type) {
  if (acc_type === 'venue') {
    const { rows } = await pool.query(`SELECT ${acc_type}, password, stage, avatar, album, rating FROM ${acc_type}s WHERE email LIKE '${email}'`);
    return rows[0];
  };
  const { rows } = await pool.query(`SELECT ${acc_type}, password, stage, avatar, album, likes FROM ${acc_type}s WHERE email LIKE '${email}'`);
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

export async function uploadNewAvatar(acc_type, email, link) {
  const { rows } = await pool.query(`SELECT * FROM ${acc_type}s WHERE email LIKE '${email}'`);
  await pool.query(`UPDATE ${acc_type}s SET avatar = '${link}' WHERE email = '${email}'`);
  if (rows[0].stage === '0') await pool.query(`UPDATE ${acc_type}s SET stage = '1' WHERE email = '${email}'`);
  if (rows[0]) return rows[0].avatar;
  return null;
};

export async function uploadNewAlbum(acc_type, email, links) {
  await pool.query(`UPDATE ${acc_type}s SET album = '${links}' WHERE email = '${email}'`);
  await pool.query(`UPDATE ${acc_type}s SET stage = '2' WHERE email = '${email}'`);
  return 'ALBUM UPLOADED';
};

export async function infoUpload(acc_type, email, hours, tables) {  
  if (acc_type === 'venue') {
    await pool.query(
      `UPDATE venues SET hours = '${hours}',
      tables = jsonb_set(tables, '{0}', '${tables}') WHERE email = '${email}'`);
    await pool.query(`UPDATE venues SET stage = '3' WHERE email = '${email}'`);
    return 'INFO UPLOADED';
  }
  await pool.query(`UPDATE customers SET stage = '3' WHERE email = '${email}'`);
  return 'INFO UPLOADED';
};