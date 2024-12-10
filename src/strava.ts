import axios from "axios";
import { ObjectId } from "mongodb";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { getUsersCollection } from "./database";

dotenv.config();

const clientId = process.env.STRAVA_CLIENT_ID;
const clientSecret = process.env.STRAVA_CLIENT_SECRET;
const redirectUri = process.env.STRAVA_REDIRECT_URI;

export const getStravaAuthUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=read,activity:read_all&state=${userId}`;
    res.redirect(authUrl);
  } catch (error) {
    console.error("Error getting Strava auth URL:", error);
    next(error);
  }
};

export const connectStrava = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { code, state } = req.query;

  if (!code || !state) {
    res.status(400).json({ message: "Code and state (userId) are required" });
    return;
  }

  try {
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
    });

    const stravaData = response.data;
    const usersCollection = getUsersCollection();

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(state as string) },
      {
        $set: {
          strava_token: stravaData.access_token,
          strava_refresh_token: stravaData.refresh_token,
        },
      }
    );

    if (result.matchedCount > 0) {
      const updatedUser = await usersCollection.findOne({ _id: new ObjectId(state as string) });
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Error connecting to Strava:", error);
    next(error);
  }
};

export const getStravaActivities = async (req: Request, res: Response) => {
  const { access_token } = req.query;

  try {
    const response = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error getting Strava activities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
