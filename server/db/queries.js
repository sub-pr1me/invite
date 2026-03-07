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

export async function createNewUser(acc_type, name, email, password, stage, rating, tables, credits) {
  if (acc_type === 'venue') {
    await pool.query(
      `INSERT INTO venues (
      venue, email, password, stage, rating, tables, credits) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
      [name, email, password, stage, rating, tables, credits]);
    return 'success';
  };
  await pool.query(
    `INSERT INTO customers (
    customer, email, password, stage, credits) 
    VALUES ($1, $2, $3, $4, $5)`, 
    [name, email, password, stage, credits]);
  return 'success';
};

export async function getUserData(email, acc_type) {
  if (acc_type === 'venue') {
    const { rows } = await pool.query(`
      SELECT ${acc_type}, password, stage, avatar, album, rating, hours, tables, credits
      FROM ${acc_type}s 
      WHERE email LIKE '${email}'`);
    return rows[0];
  };
  const { rows } = await pool.query(`
    SELECT ${acc_type}, password, stage, avatar, album, age, gender, interest, likes, credits 
    FROM ${acc_type}s 
    WHERE email LIKE '${email}'`);
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

export async function infoUpload(acc_type, email, hours, tables, stage, dob, gender, interest) {
  if (acc_type === 'venue') {
    if (stage) {
      await pool.query(`UPDATE venues SET stage = '4' WHERE email = '${email}'`);
      return 'VENUE REGISTRATION COMPLETE';
    };
    await pool.query(
      `UPDATE venues SET hours = '${hours}', tables = jsonb_set(tables, '{0}', '${tables}'),
       stage = '3' WHERE email = '${email}'`);
    const { rows } = await pool.query(`
      SELECT tables
      FROM venues 
      WHERE email LIKE '${email}'`);
    return rows[0];
  }

  const date = new Date(dob);
  const currentDate = new Date();
  let age = currentDate.getFullYear() - date.getFullYear();
  const monthDifference = currentDate.getMonth() - date.getMonth();
  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < date.getDate())) {
      age--;
  };
  await pool.query(
      `UPDATE customers SET dob = '${dob}', age = '${age}', gender = '${gender}',
       interest = '${interest}', stage = '4' WHERE email = '${email}'`);
  return 'CUSTOMER REGISTRATION COMPLETE';
};

export async function tableInfoUpdate(email, id, link) {
  const { rows } = await pool.query(`SELECT tables FROM venues WHERE email LIKE '${email}'`);
  const tables = rows[0].tables[0];
  const pic = tables.filter(item => item.id === id)[0].pic;
  const updated = tables.map(item => {if (item.id === id) {return {...item, pic: link}} else {return item}});
  const stringified = JSON.stringify(updated);
  await pool.query(`
    UPDATE venues SET tables = jsonb_set(tables, '{0}', '${stringified}') 
    WHERE email 
    LIKE '${email}'`);
  if (pic) return pic;
  return null;
};

export async function auctionUpload(email, id, deposit, step) {
  const { rows } = await pool.query(`SELECT tables FROM venues WHERE email LIKE '${email}'`);
  const tables = rows[0].tables[0];
  const updated = tables.map(item => {if (item.id === id)
    {return {...item, auction: {deposit: deposit, step: step}}} else {return item}});
  const stringified = JSON.stringify(updated);
  await pool.query(`
    UPDATE venues SET tables = jsonb_set(tables, '{0}', '${stringified}') 
    WHERE email 
    LIKE '${email}'`);
  return 'AUCTION SET';
};

export async function BalanceUpdate(email, amount, acc_type) {
  if (acc_type === 'customer') {
    const { rows } = await pool.query(`SELECT credits FROM venues WHERE email LIKE '${email}'`);
    const balance = rows[0].credits;
    const updatedBalance = parseInt(balance) + parseInt(amount);
    await pool.query(`
      UPDATE venues SET credits = '${updatedBalance}' 
      WHERE email 
      LIKE '${email}'`);
    return updatedBalance;
  };
  if (acc_type === 'venue') {
    const { rows } = await pool.query(`SELECT credits FROM venues WHERE email LIKE '${email}'`);
    const balance = rows[0].credits;
    const updatedBalance = parseInt(balance) - parseInt(amount);
    await pool.query(`
      UPDATE venues SET credits = '${updatedBalance}' 
      WHERE email 
      LIKE '${email}'`);
    return updatedBalance;
  };
};