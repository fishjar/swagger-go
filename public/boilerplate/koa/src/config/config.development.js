import path from 'path';

const sqliteDir = path.resolve(__dirname, '../db');
export default {
  DATABASE_URL: `sqlite://${path.join(sqliteDir, 'db.development.sqlite')}`,
  DATABASE_OPT: {
    dialect: 'sqlite',
  },
  LOG_LEVEL: 'debug',
};

// export default {
//   DATABASE_URL: 'mysql://root:123456@127.0.0.1:3306/testdb',
//   DATABASE_OPT: {
//     dialect: 'mysql',
//   },
//   LOG_LEVEL: 'debug',
// };
