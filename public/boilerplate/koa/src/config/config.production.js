export default {
  DATABASE_URL: 'mysql://root:123456@127.0.0.1:3306/testdb',
  DATABASE_OPT: {
    dialect: 'mysql',
    pool: {
      max: 10,
      idle: 30000,
      acquire: 60000,
    },
  },
  LOG_LEVEL: 'info',
};
