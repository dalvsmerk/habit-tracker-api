export const config = {
    server: {
        port: Number(process.env.PORT || 9000),
    },
    env: {
        isProduction: process.env.NODE_ENV === 'production',
        isDevelopment: process.env.NODE_ENV === 'production',
    },
};
