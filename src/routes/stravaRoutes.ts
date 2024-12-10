import { Router } from "express";
import {
  getStravaAuthUrl,
  getStravaActivities,
  connectStrava
} from "../strava";

const router = Router();

router.get("/auth-url", getStravaAuthUrl);
router.get("/exchange_token", connectStrava);
router.get("/activities", getStravaActivities);

export default router;
