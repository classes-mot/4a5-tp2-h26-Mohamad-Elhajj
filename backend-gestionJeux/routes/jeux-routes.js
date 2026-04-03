import express from "express";
import jeuxController from "../controllers/jeux-controller.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/getAllGames", jeuxController.getAllJeux);

router.get("/getGameById", jeuxController.getJeuById);

router.use(checkAuth);

router.post("/addGame", jeuxController.addJeu);

router.patch("/updateGame", jeuxController.updateJeu);

router.delete("/deleteGame", jeuxController.deleteJeu);

export default router;
