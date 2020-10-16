require('dotenv').config();

/* MariaDB 관련 정보 */
const C_CLOUD_DB = {
  host: process.env.C_CLOUD_DB_HOST,
  port: process.env.C_CLOUD_DB_PORT,
  user: process.env.C_CLOUD_DB_USER,
  password: process.env.C_CLOUD_DB_PASSWORD,
  database: process.env.C_CLOUD_DB_DATABASE
};

const CCLOUD_DB = {
  host: process.env.CCLOUD_DB_HOST,
  port: process.env.CCLOUD_DB_PORT,
  user: process.env.CCLOUD_DB_USER,
  password: process.env.CCLOUD_DB_PASSWORD,
  database: process.env.CCLOUD_DB_DATABASE
};


/* MSSQL 관련 정보 */
const ICON_VOICE_DB = {
  server: process.env.ICON_VOICE_DB_HOST,
  port: Number(process.env.ICON_VOICE_DB_PORT),
  user: process.env.ICON_VOICE_DB_USER,
  password: process.env.ICON_VOICE_DB_PASSWORD,
  database: process.env.ICON_VOICE_DB_DATABASE,
  requestTimeout: 300000, 
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 10
  },
  options: {
    encrypt: false
  }
};

const INFOMART_DB = {
  server: process.env.INFOMART_DB_HOST,
  port: Number(process.env.INFOMART_DB_PORT),
  user: process.env.INFOMART_DB_USER,
  password: process.env.INFOMART_DB_PASSWORD,
  database: process.env.INFOMART_DB_DATABASE,
  pool: {
    max: 5,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false
  }
};

module.exports = {
  C_CLOUD_DB,
  CCLOUD_DB,
  ICON_VOICE_DB,
  INFOMART_DB,
};
