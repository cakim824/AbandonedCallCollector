const {
    sendPreparedStatementToPortalDB,
  } = require('../utils/mariadb');
  
  const findServiceId = async () => {
      var serviceId;

      const query = `
      SELECT SERVICE_ID
      FROM   tb_service
      WHERE  SERVICE_CD = '00004'
      ;
      `;

      const parameters = [];
      const result = await sendPreparedStatementToPortalDB(query, parameters)
      .then(function (result) {
        serviceId = result[0].SERVICE_ID
      })

      return serviceId;  
    //   return await sendPreparedStatementToPortalDB(query, parameters);
  };
  
  module.exports = {
    findServiceId
  };
  