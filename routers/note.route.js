import express from "express";
import {
  createNote,
  delNote,
  getAllNotes,
  updatedPinned,
  updateNote,
} from "../controllers/notes.controller.js";

const router = express.Router();

import { verifyUser } from "../jwt/verify.user.js";

router.post("/create", verifyUser, createNote);
router.get("/getAll", verifyUser, getAllNotes);
router.put("/update/:id", verifyUser, updateNote);
router.delete("/delete/:id", verifyUser, delNote);
router.put("/updatePinned/:id", verifyUser, updatedPinned);

export default router;
