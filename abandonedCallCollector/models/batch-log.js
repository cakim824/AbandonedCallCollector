const {
    sendPreparedStatementToPortalDB,
  } = require('../utils/mariadb');
  const log = require('../utils/logger');
  const { BATCH_NAME, BATCH_STATUS } = require('../shared/constants');
  
  const create = async ({ start_timestamp, end_timestamp, state = BATCH_STATUS.PENDING, row_count = 0 }) => {
    const query = `
    INSERT INTO tb_batch_log (START_TS, END_TS, SERVICE_NAME)
    VALUES (
    ?, ?, ?
    )
    ON DUPLICATE KEY
    UPDATE STATE = ?
         , ROW_CNT = ?
    ;
    `;
    const parameters = [start_timestamp, end_timestamp, batch_name, state, row_count];
    return await sendPreparedStatementToPortalDB(query, parameters);
  };
  
  module.exports = {
    create,
  };
  