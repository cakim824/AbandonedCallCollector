const {
    sendPreparedStatementToPortalDB,
  } = require('../utils/mariadb');
  
  // const CALL_CATCHER_SERVICE_ID = 1;
  
  const find = async () => {
  
    const query = `
    SELECT T1.SITE_CD
         , T1.ROUTING_POINT
    FROM   tb_routing T1
           INNER JOIN(
             /* 콜캐처(SERVICE_ID: 1) 사용 고객사 */
             SELECT SITE_CD
             FROM tb_site_join_service
             WHERE SERVICE_ID = (SELECT SERVICE_ID FROM tb_service WHERE SERVICE_CD = '00004')
             AND LEAVE_DATE IS NULL
           ) T2 ON (T1.SITE_CD = T2.SITE_CD AND T1.ROUTING_POINT_TYPE = '0001')
    ;
    `;
    const parameters = [];
    return await sendPreparedStatementToPortalDB(query, parameters);
  };
  
  module.exports = {
    find,
  };
  