import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController";
import { checkDuplicateEmail } from "../middleware/checkDuplicateEmail";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", checkDuplicateEmail, createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
