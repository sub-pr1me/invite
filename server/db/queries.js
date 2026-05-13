import pool from './pool.js';

export async function getAllVenueData() {
  console.log('getAllVenueData');
  const { rows } = await pool.query('SELECT * FROM venues');
  
  for (let i=0; i<rows.length; i++) {
    delete rows[i].password;
    delete rows[i].reftoken;
    delete rows[i].credits;
  };
  
  return rows;
};

export async function getAllCustomerData() {
  console.log('getAllCustomerData');
  const { rows } = await pool.query('SELECT * FROM customers');
  
  for (let i=0; i<rows.length; i++) {
    delete rows[i].password;
    delete rows[i].reftoken;
    delete rows[i].credits;
  };
  
  return rows;
};

export async function checkVenuesForMatch(email) {
    // console.log('checkVenuesForMatch');
  const { rows } = await pool.query(`SELECT * FROM venues WHERE email LIKE '${email}'`);
  return rows[0];
};

export async function checkCustomersForMatch(email) {
    // console.log('checkCustomersForMatch');
  const { rows } = await pool.query(`SELECT * FROM customers WHERE email LIKE '${email}'`);
  return rows[0];
};

export async function createNewUser(acc_type, name, email, password, stage, rating, tables, dates, credits) {
    console.log('createNewUser');
  if (acc_type === 'venue') {
    await pool.query(
      `INSERT INTO venues (
      venue, email, password, stage, rating, tables, dates, credits) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, 
      [name, email, password, stage, rating, tables, dates, credits]);
    return 'success';
  };
  await pool.query(
    `INSERT INTO customers (
    customer, email, password, stage, dates, credits) 
    VALUES ($1, $2, $3, $4, $5, $6)`, 
    [name, email, password, stage, dates, credits]);
  return 'success';
};

export async function getUserData(email, acc_type) {
    console.log('getUserData');
  if (acc_type === 'venue') {
    const { rows } = await pool.query(`
      SELECT ${acc_type}, id, password, stage, avatar, album, rating, hours, tables, likes, dates, credits
      FROM ${acc_type}s 
      WHERE email LIKE '${email}'`);
    return rows[0];
  };
  const { rows } = await pool.query(`
    SELECT ${acc_type}, id, password, stage, avatar, album, dob, gender, interest, likes, dates, credits 
    FROM ${acc_type}s 
    WHERE email LIKE '${email}'`);
    return rows[0];
};

export async function addRefreshToken(acc_type, email, token) {
    console.log('addRefreshToken');
  await pool.query(`UPDATE ${acc_type}s SET refToken = '${token}' WHERE email = '${email}'`);
  return 'success';
};

export async function checkVenueToken(token) {
    // console.log('checkVenueToken');
  const { rows } = await pool.query(`SELECT * FROM venues WHERE reftoken LIKE '${token}'`);
  return rows[0];
};

export async function checkCustomerToken(token) {
    // console.log('checkCustomerToken');
  const { rows } = await pool.query(`SELECT * FROM customers WHERE reftoken LIKE '${token}'`);
  return rows[0];
};

export async function deleteRefreshToken(acc_type, email) {
    console.log('deleteRefreshToken');
  await pool.query(`UPDATE ${acc_type}s SET refToken = '' WHERE email = '${email}'`);
  return 'success';
};

export async function uploadNewAvatar(acc_type, email, link) {
    console.log('uploadNewAvatar');
  const { rows } = await pool.query(`SELECT * FROM ${acc_type}s WHERE email LIKE '${email}'`);
  await pool.query(`UPDATE ${acc_type}s SET avatar = '${link}' WHERE email = '${email}'`);
  if (rows[0].stage === '0') await pool.query(`UPDATE ${acc_type}s SET stage = '1' WHERE email = '${email}'`);
  if (rows[0]) return rows[0].avatar;
  return null;
};

export async function uploadNewAlbum(acc_type, email, links, postreg) {
    console.log('uploadNewAlbum');
  await pool.query(`UPDATE ${acc_type}s SET album = '${links}' WHERE email = '${email}'`);
  if (!postreg) await pool.query(`UPDATE ${acc_type}s SET stage = '2' WHERE email = '${email}'`);
  return 'ALBUM UPLOADED';
};

export async function infoUpload(acc_type, email, hours, tables, stage, dob, gender, interest, endreg) {
    console.log('infoUpload');
  if (acc_type === 'venue') {
    if (stage === '2') {  // pre-registration basic info
      console.log('STAGE', stage);
      const stringified = JSON.stringify(tables);
      await pool.query(
        `UPDATE venues SET hours = '${hours}', tables = jsonb_set(tables, '{0}', '${stringified}'),
         stage = '3' WHERE email = '${email}'`);
        const { rows } = await pool.query(`
          SELECT tables
          FROM venues 
          WHERE email LIKE '${email}'`
        );
        return rows[0];
    };

    if (stage === '3' && !endreg) { // pre-registration table editing
      console.log('STAGE', stage, 'endreg -', endreg);
      // console.log('line 132', tables[0]);
      // console.log('line 132', tables[1]);
      // console.log('line 132', tables[2]);
      const stringified = JSON.stringify(tables);
      await pool.query(
        `UPDATE venues SET tables = jsonb_set(tables, '{0}', '${stringified}')
         WHERE email = '${email}'`);
        const { rows } = await pool.query(`
          SELECT tables
          FROM venues 
          WHERE email LIKE '${email}'`
        );
      return rows[0];
    };

    if (stage === '3' && endreg) { // end venue registration
      console.log('INFO UPLOAD STAGE', stage, 'endreg -', endreg);
      // console.log('line 146', tables[0]);
      // console.log('line 146', tables[1]);
      // console.log('line 146', tables[2]);
      const stringified = JSON.stringify(tables);
      await pool.query(
        `UPDATE venues SET tables = jsonb_set(tables, '{0}', '${stringified}')
         WHERE email = '${email}'`);
      await pool.query(`UPDATE venues SET stage = '4' WHERE email = '${email}'`);
      return 'VENUE REGISTRATION COMPLETE';
    };

    if (stage === '4') { // post-registration table editing
      console.log('INFO UPLOAD STAGE', stage);
      // console.log('line 156', tables[0].auction);
      // console.log('line 156', tables[1].auction);
      // console.log('line 156', tables[2].auction);
      const stringified = JSON.stringify(tables);
      await pool.query(
        `UPDATE venues SET hours = '${hours}', tables = jsonb_set(tables, '{0}', '${stringified}')
        WHERE email = '${email}'`);
      const { rows } = await pool.query(`
        SELECT tables
        FROM venues 
        WHERE email LIKE '${email}'`
      );
      return rows[0];
    };
  };

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
    console.log('tableInfoUpdate');
    console.log(email);
    console.log(id);
    console.log(link);

  const { rows } = await pool.query(`SELECT tables FROM venues WHERE email LIKE '${email}'`);
  const tables = rows[0].tables[0];
  const pic = tables.filter(item => item.id === parseInt(id))[0].pic;
  const updated = tables.map(item => {if (item.id === parseInt(id))
    {return {...item, pic: link}} else {return item}});
  const stringified = JSON.stringify(updated);
  await pool.query(`
    UPDATE venues SET tables = jsonb_set(tables, '{0}', '${stringified}') 
    WHERE email 
    LIKE '${email}'`);
  if (pic) return pic;
  return null;
};

export async function auctionUpload(email, id, deposit, step, bidders, reg, venue_id) {
    console.log('auctionUpload');
  const { rows } = await pool.query(`SELECT tables FROM venues WHERE email LIKE '${email}'`);
  const tables = rows[0].tables[0];
  const updated = tables.map(item => {if (item.id === id.toString() || item.id === id)
    {return {...item, auction: {deposit: deposit, step: step, bidders: bidders, reg: reg, venue_id: venue_id}}} else {return item}}
  );
  const stringified = JSON.stringify(updated);

  await pool.query(`
    UPDATE venues SET tables = jsonb_set(tables, '{0}', '${stringified}') 
    WHERE email 
    LIKE '${email}'`);
  return updated;
};

export async function BalanceUpdate(email, amount, acc_type, deposit) {
    console.log('BalanceUpdate');
  const { rows } = await pool.query(`SELECT credits FROM ${acc_type}s WHERE email LIKE '${email}'`);
  const balance = rows[0].credits;
  const cashout = parseInt(balance) - parseInt(amount);
  const dep = parseInt(balance) + parseInt(amount);
  await pool.query(`
    UPDATE ${acc_type}s SET credits = '${acc_type === 'venue' && !deposit ? cashout : dep}' 
    WHERE email 
    LIKE '${email}'`);
  if (acc_type === 'venue' && !deposit) return cashout;

  return dep;
};

export async function FetchAuctions() {
    console.log('FetchAuctions');
  let auctions = [];
  const { rows } = await pool.query('SELECT venue, email, tables FROM venues');

    for (let i=0; i<rows.length; i++) {
    if (rows[i].tables[0]) {
      const filtered = rows[i].tables[0].filter(item => item.auction.deposit);

      filtered.map(item => {
        const arr = [];
        for (let i=0; i<3; i++) {
          if (typeof item.auction.bidders[i] === 'string') {
            arr.push(JSON.parse(item.auction.bidders[i]));
          } else {
            arr.push(item.auction.bidders[i]);
          }
        };
        item.venue_id = item.auction.venue_id;
        item.venue_email = rows[i].email;
        item.name = rows[i].venue;
        item.id = parseInt(item.id);
        item.step = parseInt(item.auction.step);
        item.deposit = parseInt(item.auction.deposit);
        item.bidders = arr;
        item.reg = item.auction.reg;
        delete item.modal;
        delete item.active;
        delete item.auction;
        auctions.push(item);
      });
    };
  };

  return auctions;
};

export async function BiddersUpdate(bidders, venue_email, table) {
    console.log('BiddersUpdate');
  const { rows } = await pool.query(`SELECT tables FROM venues WHERE email LIKE '${venue_email}'`);
  const tables = rows[0].tables[0];
  
  // console.log(`BEFORE #${parseInt(table)} BID UPDATE`, tables[parseInt(table)-1].auction)
  const updated = tables.map(item => {if (item.id === parseInt(table))
    {return {...item, auction: {...item.auction, bidders: JSON.parse(bidders)}}} else {return item}}
  );
  
  // console.log(`AFTER #${parseInt(table)} BID UPDATE`,updated[parseInt(table)-1].auction);
  const stringified = JSON.stringify(updated);

  await pool.query(`
    UPDATE venues SET tables = jsonb_set(tables, '{0}', '${stringified}') 
    WHERE email 
    LIKE '${venue_email}'`
  );

  return 'BIDDERS UPDATED?'

};

export async function AddTable(email, id, active, venue_id) {
    console.log('AddTable:', id);
  const new_table = {
    id: parseInt(id), 
    pic: '', 
    active: JSON.parse(active), 
    modal: false, 
    auction: {deposit: null, step: null, bidders: [0,0,0], reg: true, venue_id: venue_id}
  };
  const { rows } = await pool.query(`
    SELECT tables
    FROM venues 
    WHERE email LIKE '${email}'`
  );
  const tables = rows[0].tables[0];
  const updated = tables.map(item => {if (item.id === parseInt(id)) {
    return new_table;
  } else {return item}});
  const stringified = JSON.stringify(updated);
  
  await pool.query(`
    UPDATE venues SET tables = jsonb_set(tables, '{0}', '${stringified}') 
    WHERE email 
    LIKE '${email}'`
  );
  return updated;
};

export async function FetchProfileData(role, id, from) {
  
  console.log('FetchProfileData', role, id, 'from', from);
  
  if (role === 'venue') {
    const { rows } = await pool.query(`
      SELECT venue, email, avatar, album, hours, tables, likes, dates, credits
      FROM venues 
      WHERE id = ${parseInt(id)}`
    );
    return rows[0];
  };

  const { rows } = await pool.query(`
    SELECT customer, email, avatar, album, dob, gender, interest, likes, dates, credits 
    FROM customers 
    WHERE id = ${parseInt(id)}`
  );
  return rows[0];
};

export async function SwitchLike(email, role, id) {
    console.log('SwitchLike');
  const { rows } = await pool.query(`SELECT likes FROM ${role}s WHERE id = ${parseInt(id)}`);
  const arr = rows[0].likes;
  console.log('CURRENT LIKES:', arr);
  if (!arr || !arr[0]) {
    const updated = [];
    await pool.query(`UPDATE ${role}s SET likes = '{${email}}' WHERE id = '${parseInt(id)}'`);
    updated.push(email);
    return updated;
  };
  if (arr.includes(email)) {
    const updated = [];
    for (const item of arr) if (item !== email) updated.push(item);
    await pool.query(`UPDATE ${role}s SET likes = '{${updated.toString()}}' WHERE id = '${parseInt(id)}'`);
    return updated;
  };
  if (!arr.includes(email)) {
    arr.push(email);
    await pool.query(`UPDATE ${role}s SET likes = '{${arr.toString()}}' WHERE id = '${parseInt(id)}'`);
    return arr;
  };
};

export async function FetchAvatar(email, role) {
    console.log('FetchAvatar');
  if (role === 'venue') {
    const { rows } = await pool.query(`
      SELECT avatar, id FROM venues 
      WHERE email LIKE '${email}'`
    );
    return rows[0];
  };
  const { rows } = await pool.query(`
    SELECT avatar, id FROM customers 
    WHERE email LIKE '${email}'`
  );
  return rows[0];
};

export async function NewDateUpload(venue, host, guest, new_date) {
    console.log('NewDateUpload');

  const arr = [host, guest, venue];

  while (arr.length) {
    if (arr.length > 1) {
      const { rows } = await pool.query(`SELECT dates FROM customers WHERE email LIKE '${arr[0]}'`);
      let dates = rows[0].dates[0];

    if (dates) {
      dates.push(new_date);
    } else {
      dates = [new_date];
    };
      
      const stringified = JSON.stringify(dates);

      await pool.query(`
        UPDATE customers SET dates = jsonb_set(dates, '{0}', '${stringified}') 
        WHERE email 
        LIKE '${arr[0]}'`
      );
      arr.shift();
    } else {
      const { rows } = await pool.query(`SELECT dates FROM venues WHERE email LIKE '${arr[0]}'`);
      let dates = rows[0].dates[0];
      if (dates) {
        dates.push(new_date);
      } else {
        dates = [new_date];
      };

      const stringified = JSON.stringify(dates);

      await pool.query(`
        UPDATE venues SET dates = jsonb_set(dates, '{0}', '${stringified}') 
        WHERE email 
        LIKE '${arr[0]}'`
      );
      arr.shift();
    };
  };

  const { rows } = await pool.query(`SELECT tables FROM venues WHERE email LIKE '${venue}'`);
  const tables = rows[0].tables[0];
  const updated = tables.map(item => {
    if (item.id === parseInt(new_date.table)) {
      return {...item, auction: {
        deposit: null, 
        step: null, 
        bidders: [0,0,0], 
        reg: true, 
        venue_id: parseInt(new_date.table)}};
    } else { return item };
  });

  const stringified = JSON.stringify(updated);

  await pool.query(`
    UPDATE venues SET tables = jsonb_set(tables, '{0}', '${stringified}') 
    WHERE email 
    LIKE '${venue}'`
  );
  return updated;
};

export async function ArchiveVenueDate (venue, date, endTime) {
  console.log('ArchiveVenueDate');

    const { rows } = await pool.query(`SELECT dates FROM venues WHERE email LIKE '${venue}'`);
    
    let dates = rows[0].dates[0];

    const updated = dates.map(item => {
      if (item.venue === date.venue && item.host === date.host && item.guest === date.guest) {
        return {...item, status: 'archived', endTime: endTime}      
      } else { return item }
    });
    
    const stringified = JSON.stringify(updated);

    await pool.query(`
      UPDATE venues SET dates = jsonb_set(dates, '{0}', '${stringified}') 
      WHERE email 
      LIKE '${venue}'`
    );
  return 'success';
};

export async function ArchiveHostDate (host, date, endTime) {
  console.log('ArchiveHostDate');

    const { rows } = await pool.query(`SELECT dates FROM customers WHERE email LIKE '${host}'`);
    
    let dates = rows[0].dates[0];

    const updated = dates.map(item => {
      if (item.venue === date.venue && item.host === date.host && item.guest === date.guest) {
        return {...item, status: 'archived', endTime: endTime}      
      } else { return item }
    });
    
    const stringified = JSON.stringify(updated);

    await pool.query(`
      UPDATE customers SET dates = jsonb_set(dates, '{0}', '${stringified}') 
      WHERE email 
      LIKE '${host}'`
    );
  return 'success';
};

export async function ArchiveGuestDate (guest, date, endTime) {
  console.log('ArchiveGuestDate');

    const { rows } = await pool.query(`SELECT dates FROM customers WHERE email LIKE '${guest}'`);
    
    let dates = rows[0].dates[0];

    const updated = dates.map(item => {
      if (item.venue === date.venue && item.host === date.host && item.guest === date.guest) {
        return {...item, status: 'archived', endTime: endTime}      
      } else { return item }
    });
    
    const stringified = JSON.stringify(updated);

    await pool.query(`
      UPDATE customers SET dates = jsonb_set(dates, '{0}', '${stringified}') 
      WHERE email 
      LIKE '${guest}'`
    );
  return 'success';
};

export async function EditInfo(email, acc_type, new_name, new_email, new_hours) {
  console.log('EditInfo');
  if (new_name) {
    const updates = {};
    
    // EDIT CUSTOMER NAME IN AUCTIONS
    
    if (acc_type === 'customer') {
      const { rows } = await pool.query(`SELECT email, tables FROM venues`);
      const haveTables = rows.filter(item => item.tables[0]);

      for (let i=0; i<haveTables.length; i++) {
        const tables = haveTables[i].tables[0];
        let upd = false;

        const updatedTables = tables.map(item => {

          if (item.auction.bidders.some(obj => obj.email == email)) {
            upd = true;
            const updatedBidders = item.auction.bidders.map(elem => {
              if (elem.email === email) {
                return {...elem, name: new_name}
              } else { return elem }
            });

            return {...item, auction: {...item.auction, bidders: updatedBidders}}

          } else { return item };
        });

        if (upd) {
          const stringified = JSON.stringify(updatedTables);
          await pool.query(
            `UPDATE venues SET tables = jsonb_set(tables, '{0}', '${stringified}')
            WHERE email = '${haveTables[i].email}'`
          );
        };
        updates.tables = updatedTables;
      };
    };

    // EDIT VENUE NAME IN DATES

    if (acc_type === 'venue') {
      const { rows } = await pool.query(`SELECT dates FROM venues WHERE email LIKE '${email}'`);
      const dates = rows[0].dates[0];

      if (dates?.length) {

        const updatedDates = dates.map(item => { return {...item, venue_name: new_name} });
        const stringified = JSON.stringify(updatedDates);

        await pool.query(
          `UPDATE venues SET dates = jsonb_set(tables, '{0}', '${stringified}') WHERE email = '${email}'`
        );
        updates.dates = updatedDates;
      };

      const customerDatesData = await pool.query(`SELECT email, dates FROM customers`);    
      const customersWithDates = customerDatesData.rows.filter(item => item.dates[0]);

      for (let i=0; i<customersWithDates.length; i++) {
        const dates = customersWithDates[i].dates[0];
        let upd = false;

        const updatedDates = dates.map(item => {
          if (item.venue == email) {
            upd = true;
            return {...item, venue_name: new_name}          
          } else { return item };
        });

        if (upd) {
          const stringified = JSON.stringify(updatedDates);
          await pool.query(
            `UPDATE customers SET dates = jsonb_set(dates, '{0}', '${stringified}')
            WHERE email = '${customersWithDates[i].email}'`
          );
        };
      };
    };

    // EDIT VENUE / CUSTOMER NAME IN PROFILE

    await pool.query(`UPDATE ${acc_type}s SET ${acc_type} = '${new_name}' WHERE email = '${email}'`);
    updates.message = `${acc_type} name has been changed to "${new_name}"`;

    return updates;
  };

  if (new_email) {
    // await pool.query(
    //   `UPDATE ${acc_type}s SET email = '${new_email}'
    //    WHERE email = '${email}'`);
    // return;
  };
  if (new_hours) {
    // await pool.query(
    //   `UPDATE venues SET hours = '${new_hours}'
    //    WHERE email = '${email}'`);
    // return;
  };
};