import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.DB_PORT
export const HOST= process.env.DB_HOST
export const PASSWORD = process.env.DB_PASSWORD
export const USERNAME = process.env.DB_USERNAME
export const DATABASE = process.env.DB_NAME
