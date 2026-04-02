import express from "express";

import usersController from "../controllers/users-controller.js";
const router = express.Router();

router.post("/register", usersController.inscription);

router.post("/login", usersController.connexion);

export default router;
