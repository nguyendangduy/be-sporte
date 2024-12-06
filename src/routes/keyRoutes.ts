import { Router } from "express";
import { importKeys } from "../controllers/keyController";
import upload from '../middleware/upload';

const router = Router();

router.post('/import', upload.single('file'), importKeys);

export default router;