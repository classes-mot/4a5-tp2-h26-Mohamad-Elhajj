import express from "express";
import jeuxController from "../controllers/jeux-controller.js";
import { check } from "express-validator";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/getAllGames", jeuxController.getAllJeux);

router.get("/getGamesById/:jid", jeuxController.getJeuxById);

router.post(
  "/addGame",
  [checkAuth, check("titre").not().isEmpty()],
  jeuxController.addJeu,
);

router.patch("/updateGame/:jid", [checkAuth], jeuxController.updateJeu);

router.delete("/deleteGame/:jid", [checkAuth], jeuxController.deleteJeu);

export default router;
