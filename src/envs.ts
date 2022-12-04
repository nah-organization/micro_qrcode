export const hostname = process.env.MICRO_QR_HOSTNAME ?? 'localhost';
export const realPort = +(process.env.MICRO_QR_REAL_PORT ?? '') || 443;

export const topRedirect = process.env.MICRO_QR_TOP_REDIRECT ?? 'https://example.com/';
