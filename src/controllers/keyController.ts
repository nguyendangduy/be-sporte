import { Request, Response } from "express";
import { getKeysCollection } from "../database";
import { generateRandomString } from '../utils/randomString';

export async function getKeyActive() {
  try {
    const keysCollection = getKeysCollection();
    let filter: any = {};
    filter.userId = null;
    const key = await keysCollection.findOne(filter);
    if(key) {
      return key;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching key:', error);
  }
}

export async function createKey(req: Request, res: Response) { 
  try {
    const keysCollection = getKeysCollection();
    const key = {
      code: generateRandomString(10),
      event: 'RUNNING',
    };
    const result = await keysCollection.insertOne(key);
    const insertedKey = await keysCollection.findOne({ _id: result.insertedId });
    res.json(insertedKey);
  } catch (error) {
    console.error('Error fetching key:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}