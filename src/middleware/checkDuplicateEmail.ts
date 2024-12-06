import { Request, Response, NextFunction } from "express";
import { getUsersCollection } from "../database";

export const checkDuplicateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const usersCollection = getUsersCollection();
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error checking duplicate email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
