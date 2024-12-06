import { Collection, Db , MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { User } from './models/user';
import { Key } from './models/key';

config();

const url = process.env.MONGODB_URI as string;
const client = new MongoClient(url);

let db: Db;

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(process.env.DATABASE_NAME);
    return db;

  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

export function getUsersCollection(): Collection<User> {
  if(!db) {
    throw new Error('Database is not connected');
  }

  return db.collection<User>('users');
}

export function getKeysCollection(): Collection<Key> {
  if(!db) {
    throw new Error('Database is not connected');
  }

  return db.collection<Key>('keys');
}