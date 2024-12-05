import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getUsersCollection } from "../database";
import { User } from "../models/user";

export async function getUsers(req: Request, res: Response) {
  const usersCollection = getUsersCollection();
  const users = await usersCollection.find().toArray();
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const usersCollection = getUsersCollection();
  const { id } = req.params;
  const user = await usersCollection.findOne({ _id: new ObjectId(id).toString() });
  if(user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
}

export async function createUser(req: Request, res: Response) { 
  const usersCollection = getUsersCollection();
  const user: User = req.body;
  const result = await usersCollection.insertOne(user);
  const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
  res.json(insertedUser);
}

export async function updateUser(req: Request, res: Response) {
  const usersCollection = getUsersCollection();
  const { id } = req.params;
  const user: User = req.body;
  const result = await usersCollection.replaceOne({ _id: new ObjectId(id).toString() }, user);
  if(result.modifiedCount > 0) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
}

export async function deleteUser(req: Request, res: Response) {   
  const usersCollection = getUsersCollection();
  const { id } = req.params;
  const result = await usersCollection.deleteOne({ _id: new ObjectId(id).toString() });
  if(result.deletedCount > 0) {
    res.send('User deleted');
  } else {
    res.status(404).send('User not found');
  }
}