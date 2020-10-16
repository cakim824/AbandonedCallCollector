const { clone } = require('ramda');

const {
  sendSimpleStatementToPortalDB,
  sendPreparedStatementToPortalDB,
} = require('../utils/mariadb');
const {
  lengthNotZero
} = require('../utils/common');

const find = async ({ startDate, endDate }) => {
  const query = `
  SELECT CALL_ID
       , CALL_NUMBER
       , FINISH_YN
  FROM   tb_callback
  WHERE  IN_DATE BETWEEN ? AND ?
  ;
  `;
  const parameters = [startDate, endDate];
  return await sendPreparedStatementToPortalDB(query, parameters);
};

const create = async data => {
  const query = `
  INSERT INTO tb_callback (
    SITE_CD, 
    IN_DATE, 
    IN_TIME, 
    IN_DATETIME, 
    CALL_ID, 
    CALL_ANI, 
    CALL_NUMBER, 
    ENDPOINT_DN, 
    DNIS,
    IN_TYPE, 
    IN_DETAIL_TYPE, 
    FINISH_YN
    ) VALUES ?
  ;
  `;
  const parameters = [data];
  const { affectedRows: affected_rows } =  lengthNotZero(data) ? await sendSimpleStatementToPortalDB(query, parameters) : { affectedRows: 0 };
  return clone(affected_rows);
};

module.exports = {
  find,
  create,
};
