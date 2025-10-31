import { AppDataSource } from './data-source';

export async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    
    console.log('Database connected');
  }
}
