export default ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';
  const databaseUrl = env('DATABASE_URL', '');

  if (databaseUrl) {
    const url = new URL(databaseUrl);
    return {
      connection: {
        client: 'mysql',
        connection: {
          host: url.hostname,
          port: parseInt(url.port, 10),
          database: url.pathname.slice(1),
          user: url.username,
          password: url.password,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        },
      },
    };
  }

  // Development fallback: SQLite
  return {
    connection: {
      client: env('DATABASE_CLIENT', 'sqlite'),
      connection: {
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
  };
};
