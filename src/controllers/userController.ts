import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getUsersCollection } from "../database";
import { User } from "../models/user";

export async function getUsers(req: Request, res: Response) {
  try {
    const usersCollection = getUsersCollection();
    const users = await usersCollection.find().toArray();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const usersCollection = getUsersCollection();
    const { id } = req.params;
    const user = await usersCollection.findOne({
      _id: new ObjectId(id),
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const usersCollection = getUsersCollection();
    const now = new Date();
    const user: User = {
      ...req.body,
      created_at: now,
      updated_at: now,
    };
    const result = await usersCollection.insertOne(user);
    const insertedUser = await usersCollection.findOne({
      _id: result.insertedId,
    });

    res.json(insertedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const usersCollection = getUsersCollection();
    const { id } = req.params;
    const user: Partial<User> = req.body;

    user.updated_at = new Date();

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: user }
    );

    if (result.matchedCount > 0) {
      const updatedUser = await usersCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(updatedUser);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const usersCollection = getUsersCollection();
    const { id } = req.params;
    const result = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (result.deletedCount > 0) {
      res.send("User deleted");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
