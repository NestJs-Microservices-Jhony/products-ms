import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const validationResult = envSchema.validate(process.env);
const error = validationResult.error;
const value = validationResult.value as EnvVars;

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envConfig = {
  port: value.PORT,
  databaseUrl: process.env.DATABASE_URL,
};
