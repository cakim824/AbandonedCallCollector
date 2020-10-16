require('dotenv').config();
const mariadb = require("mysql2/promise");
const { C_CLOUD_DB } = require('../config/db');

// query Sample
// const query = "SELECT * FROM tb_agent WHERE SITE_CD = ?";

// query parameter Sample
// const parameters = ["Dev"];

const getConnection = db_config => mariadb.createConnection(db_config);

const sendSimpleStatementTo = db_config => async (query, parameters = []) => {
  try {
    const connection = await getConnection(db_config);
    const [rows] = await connection.query(query, parameters);
    connection.end();
    return rows;
  } catch (error) {
    console.log('[sendSimpleStatementTo]error:', error)
    throw error;
  }
};

const sendPreparedStatementTo = db_config => async (query, parameters = []) => {
  try {
    const connection = await getConnection(db_config);
    const [rows] = await connection.execute(query, parameters);
    connection.end();
    return rows;
  } catch (error) {
    console.log('[sendPreparedStatementTo]error:', error)
    throw error;
  }
};

const sendSimpleStatementToPortalDB = sendSimpleStatementTo(C_CLOUD_DB);
const sendPreparedStatementToPortalDB = sendPreparedStatementTo(C_CLOUD_DB);

module.exports = {
  getConnection,
  sendSimpleStatementToPortalDB,
  sendPreparedStatementToPortalDB,
};
