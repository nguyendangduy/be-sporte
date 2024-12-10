import express from "express";
import { connectToDatabase } from "./database";
import userRoutes from "./routes/userRoutes";
import stravaRoutes from "./routes/stravaRoutes";

const app = express();
const port = 3000;
const prelix = "/api/v1";

app.use(express.json());

connectToDatabase()
  .then((db) => {
    app.get("/", (req, res) => {
      res.send("Hello, world!");
    });

    app.use(`${prelix}/users`, userRoutes);
    app.use(`${prelix}/strava`, stravaRoutes);

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
  });
