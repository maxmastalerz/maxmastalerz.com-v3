module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('MYSQL_HOST'),
        port: env.int('MYSQL_PORT'),
        database: env('MYSQL_DATABASE'),
        username: env('MYSQL_USER'),
        password: env('MYSQL_PASSWORD'),
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});

/*
client: 'sqlite',
filename: env('DATABASE_FILENAME', '.tmp/data.db'),
*/