import { Router } from "express";
import { createKey } from "../controllers/keyController";

const router = Router();

router.post('/', createKey);

export default router;