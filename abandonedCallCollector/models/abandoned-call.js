const {
    sendPreparedStatementToIconVoice,
  } = require('../utils/mssql');
  const {
    checkMandatoryParameters,
  } = require('../utils/common');
  const { CALL_CATCHER_TYPES } = require('../shared/constants');
  
  const find = async (start_timestamp, end_timestamp) => {
      const mandatory_parameters = { 
        start_timestamp, 
        end_timestamp,
      };
  
      checkMandatoryParameters(mandatory_parameters);
  
      const query = `
      SELECT
          X.CALLID, X.TENANT_KEY, X.ROUTING_POINT, X.CALLER, X.ENDPOINTDN AS ENDPOINT_DN, X.END_TIME, X.GUBUN AS CAUSE
      FROM
        (SELECT T1.CALLID
           , T1.TENANTID AS TENANT_KEY
           , T1.CALLDNIS AS ROUTING_POINT
           , T1.CALLANI AS CALLER
           , T2.ENDPOINTDN
           , CONVERT(CHAR(19), DATEADD(HOUR, 9, T1.TERMINATED), 20) AS END_TIME
           , (CASE WHEN T3.CCEVENT = 1 AND T3.CCEVENTCAUSE = 6 AND T3.PREVSTATE = 5 AND T1.CALLDNIS <> T2.ENDPOINTDN THEN '00001'
              WHEN T3.CCEVENT = 13 AND T3.CCEVENTCAUSE = 12 AND T3.PREVSTATE = 5 AND T1.CALLDNIS <> T2.ENDPOINTDN THEN '00002'
              WHEN T3.CCEVENT = 1 AND T3.CCEVENTCAUSE = 6 AND T3.PREVSTATE = 2 THEN '00003'
              ELSE 'SKIP'
             END) as GUBUN
        FROM   G_CALL T1 with(nolock)
             INNER JOIN G_PARTY T2 with(nolock) ON T1.CALLID = T2.CALLID
             INNER JOIN G_PARTY_HISTORY T3 with(nolock) ON T2.PARTYID = T3.PARTYID
        WHERE  T1.TERMINATED_TS BETWEEN @start_timestamp AND @end_timestamp
        AND    T1.CALLTYPE = 2
        ) X
      WHERE X.GUBUN IN ('00001', '00002', '00003')
      ORDER BY X.GUBUN;
      `;
  
      const parameters = {
        start_timestamp,
        end_timestamp,
      };
      
      const parameter_types = {
        start_timestamp: 'Int',
        end_timestamp: 'Int',
      };
  
      return await sendPreparedStatementToIconVoice(query, parameters, parameter_types);
  };
  
  module.exports = {
    find,
  };
  