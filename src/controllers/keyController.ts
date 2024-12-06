import { Request, Response } from "express";
import { getKeysCollection } from "../database";
import csv from "csv-parser";
import { Readable } from "stream";

export async function getKeyActive() {
  try {
    const keysCollection = getKeysCollection();
    let filter: any = {};
    filter.userId = null;
    const key = await keysCollection.findOne(filter);
    if (key) {
      return key;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching key:", error);
  }
}

export const importKeys = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const keysCollection = getKeysCollection();
    const file = req.file;
    const keys: any[] = [];
    const now = new Date();

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const stream = Readable.from(file.buffer.toString());
    stream
      .pipe(csv())
      .on("data", (data) => {
        data.created_at = now;
        data.updated_at = now;
        keys.push(data);
      })
      .on("end", async () => {
        await keysCollection.insertMany(keys);
        res.status(201).json({ message: "Keys imported successfully" });
      });
  } catch (error) {
    console.error("Error importing keys:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
