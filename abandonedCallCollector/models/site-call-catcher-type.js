const {
    sendPreparedStatementToPortalDB,
  } = require('../utils/mariadb');
  const { isOverThenZero } = require('../utils/common');
  
  const find = async ({ tenant_key, site_cd } = {}) => {
    const tenant_key_filter = isOverThenZero(tenant_key) ? `AND  TENANT_KEY = ?` : '';
    const site_cd_filter = site_cd ? `AND  SITE_CD = ?` : '';
    const query = `
    SELECT SITE_CD
         , CALL_CATCHER_TYPE AS CAUSE
         , USE_YN
    FROM   tb_site_call_catcher_type
    WHERE  1=1
    ${tenant_key_filter}
    ${site_cd_filter}
    ;
    `;
    const parameters = [];
  
    if (tenant_key > 0) {
      parameters.push(tenant_key);
    }
  
    if (site_cd) {
      parameters.push(site_cd);
    }
  
    return await sendPreparedStatementToPortalDB(query, parameters);
  };
  
  module.exports = {
    find,
  };
  