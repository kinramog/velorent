import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Bicycle } from './entities/Bicycle';
import { Rental } from './entities/Rental';
import { Station } from './entities/Station';
import { Review } from './entities/Review';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true, // автоматическое создание таблиц. Удалить на проде
    logging: false,
    entities: [User, Bicycle, Rental, Station, Review],
});
