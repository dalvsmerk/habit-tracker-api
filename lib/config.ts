export const config = {
    server: {
        port: Number(process.env.PORT || 9000),
    },
    env: {
        isProduction: process.env.NODE_ENV === 'production',
        isDevelopment: process.env.NODE_ENV === 'development',
    },
    db: {
      client: 'sqlite3',
      connection: {
        filename: './dev.sqlite3'
      },
      useNullAsDefault: true,
    },
};
