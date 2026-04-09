import { Jeu } from "../models/jeu.js";
import User from "../models/user.js";
import HttpError from "../utils/http-error.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

const getAllJeux = async (req, res, next) => {
  const jeux = await Jeu.find().exec();
  res.json({ jeux: jeux });
};

const getJeuxById = async (req, res, next) => {
  const jeuId = req.params.jid;

  let jeu;
  try {
    jeu = await Jeu.findById(jeuId);
  } catch (e) {
    console.log(e);
    const erreur = new HttpError("Une erreur BD est survenue", 500);
    return next(erreur);
  }

  if (!jeu) {
    return next(new HttpError("Aucun jeu trouvé", 404));
  }

  res.json({
    jeu: jeu.toObject({ getters: true }),
  });
};

const addJeu = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      new HttpError("données saisies invalides valider votre payload", 422),
    );
  }
  const { titre, categorie, duree, nbrJoueur } = req.body;
  const userId = req.userData.userId;

  const createdJeu = new Jeu({
    titre,
    categorie,
    duree,
    nbrJoueur,
    assignee: userId,
  });
  // vérifier si l'utilisateur existe
  let user;
  try {
    user = await User.findById(userId);
  } catch (e) {
    console.log(e);
    const err = new HttpError("Une erreur BD est survenue", 500);
    return next(err);
  }
  if (!user) {
    const err = new HttpError("Utilisateur non trouvé", 404);
    return next(err);
  }
  try {
    await createdJeu.save();
    user.jeux.push(createdJeu);
    await user.save();
  } catch (e) {
    const err = new HttpError("Création dans la BD échouée.", 500);
    return next(err);
  }
  //201 standard pour créé avec succès
  res.status(201).json({ jeu: createdJeu });
};

const updateJeu = async (req, res, next) => {
  const jeuId = req.params.jid;
  const jeuUpdates = req.body;

  try {
    const jeu = await Jeu.findByIdAndUpdate(jeuId, jeuUpdates, {
      new: true,
    }).populate("assignee");

    if (!jeu) {
      return res.status(404).json({ message: "Jeu non trouvé" });
    }

    res.status(200).json({ jeu: jeu.toObject({ getters: true }) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erreur lors de la mis à jour du jeu." });
  }
};

const deleteJeu = async (req, res, next) => {
  const jeuId = req.params.jid;

  try {
    const jeu = await Jeu.findById(jeuId).populate("assignee");
    if (!jeu) {
      return res.status(404).json({ message: "Jeu non trouvé" });
    }
    await jeu.deleteOne();
    jeu.assignee.jeux.pull(jeu._id);
    await jeu.assignee.save();

    res.status(200).json({ message: "Jeu supprimé." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erreur lors de la suppression du jeu." });
  }
};

export default {
  getAllJeux,
  getJeuxById,
  addJeu,
  updateJeu,
  deleteJeu,
};
