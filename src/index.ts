import express from "express";
import { connectToDatabase } from "./database";
import userRoutes from "./routes/userRoutes";
import stravaRoutes from "./routes/stravaRoutes";
import stravaWebhookRoutes from "./stravaWebhookRoutes"; // Import the new routes

const app = express();
const port = 3000;
const prefix = "/api/v1";

app.use(express.json());

connectToDatabase()
  .then((db) => {
    app.get("/", (req, res) => {
      res.send("Hello, world!");
    });

    app.use(`${prefix}/users`, userRoutes);
    app.use(`${prefix}/strava`, stravaRoutes);
    app.use(stravaWebhookRoutes);

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
  });
