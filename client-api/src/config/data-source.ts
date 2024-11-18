import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { validateEnvVars } from './setup';
import { Client } from 'src/client/entities/client.entity';
import { User } from 'src/auth/entities/user.entity';
import { Log } from 'src/log/entities/log.entity';

config(); 
validateEnvVars();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Client, User, Log],
  migrations: ['./dist/migrations/*.js'],
  synchronize: false,
  logging: true,
});
