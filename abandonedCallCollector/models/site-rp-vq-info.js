const {
    sendPreparedStatementToPortalDB,
  } = require('../utils/mariadb');
  
  //const CALL_CATCHER_SERVICE_ID = 1;
  
  const findDnisWithEndpointDn = async ({ siteCd, endpointDn }) => {
    const query = `
    SELECT A.ROUTING_POINT
    FROM   tb_rp_vq_mapping_log_detail A,
           (SELECT PREV_MAPPING_INDEX
            FROM tb_rp_vq_mapping_log_detail
            WHERE SITE_CD= '${siteCd}'
            AND APPLY_DATE= (SELECT MAX(APPLY_DATE)
                             FROM tb_rp_vq_mapping_log
                             WHERE APPLY_DATE <= date_format(now(),'%Y%m%d')
                             AND SITE_CD= '${siteCd}')
            AND ROUTING_POINT = '${endpointDn}') X
    WHERE A.MAPPING_INDEX = X.PREV_MAPPING_INDEX;
    `;
  
    const parameters = [];
    return await sendPreparedStatementToPortalDB(query, parameters);
  };
  
  const findLastApplyed = async () => {
  
    const query = `
    SELECT
      A.SITE_CD, B.APPLY_DATE, B.INFOMART_MODE,
      (SELECT ROUTING_POINT FROM tb_rp_vq_mapping_log_detail WHERE MAPPING_INDEX = B.PREV_MAPPING_INDEX AND SITE_CD = B.SITE_CD AND PREV_MAPPING_INDEX IS NULL) AS DNIS,
      B.ROUTING_POINT AS ENDPOINT_DN 
      -- B.MAPPING_INDEX, B.PREV_MAPPING_INDEX
    FROM (SELECT SITE_CD FROM tb_site_join_service WHERE SERVICE_ID = (SELECT SERVICE_ID FROM tb_service WHERE SERVICE_CD = '00004') AND LEAVE_DATE IS NULL) A
      INNER JOIN tb_rp_vq_mapping_log_detail B ON A.SITE_CD = B.SITE_CD
    WHERE B.INFOMART_MODE = (SELECT COM_SNM AS INFOMART_MODE FROM TB_SCODE WHERE COM_LCD = 'IM001' AND COM_SCD = 'MODE' AND USE_YN = 'Y')
          AND B.APPLY_DATE = (SELECT MAX(APPLY_DATE) FROM tb_rp_vq_mapping_log WHERE SITE_CD = A.SITE_CD)
      AND B.PREV_MAPPING_INDEX IS NOT NULL
    ;
    `;
  
    const parameters = [];
    return await sendPreparedStatementToPortalDB(query, parameters);
  };
  
  module.exports = {
    findDnisWithEndpointDn,
    findLastApplyed,
  };
  