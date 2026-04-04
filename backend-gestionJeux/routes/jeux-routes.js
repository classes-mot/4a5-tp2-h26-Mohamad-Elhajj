import express from "express";
import jeuxController from "../controllers/jeux-controller.js";
import { check } from "express-validator";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/getAllGames", jeuxController.getAllJeux);

router.get("/getGamesById/:uid", jeuxController.getJeuxById);

router.post(
  "/addGame",
  [checkAuth, check("titre").not().isEmpty()],
  jeuxController.addJeu,
);

router.patch("/updateGame", [checkAuth], jeuxController.updateJeu);

router.delete("/deleteGame", [checkAuth], jeuxController.deleteJeu);

export default router;
