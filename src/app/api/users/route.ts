import { AppDataSource } from '@/src/db/data-source';
import { connectDB } from '@/src/db/db';
import { User } from '@/src/db/entities/User';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const userRepo = AppDataSource.getRepository(User);
  const users = await userRepo.find();
  
  return NextResponse.json(users);
}
