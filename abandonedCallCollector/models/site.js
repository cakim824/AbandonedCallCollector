const {
    sendPreparedStatementToPortalDB,
  } = require('../utils/mariadb');
  
  const find = async () => {
    const query = `
    SELECT SITE_CD
         , TENANT_KEY
    FROM   tb_site
    ;
    `;
    const parameters = [];
    return await sendPreparedStatementToPortalDB(query, parameters);
  };
  
  module.exports = {
    find,
  };
  