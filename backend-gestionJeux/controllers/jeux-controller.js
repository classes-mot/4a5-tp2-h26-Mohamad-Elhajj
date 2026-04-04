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
  const userId = req.params.uid;

  let jeuxForUser;
  try {
    jeuxForUser = await Jeu.find({ assignee: userId });
  } catch (e) {
    const erreur = new HttpError("Une erreur BD est survenue", 500);
    return next(err);
  }

  if (!jeuxForUser || jeuxForUser.length === 0) {
    return next(new HttpError("Aucun jeu trouvée pour cet utilisateur", 404));
  }

  res.json({
    jeux: jeuxForUser.map((jeu) => jeu.toObject({ getters: true })),
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

const updateJeu = async (req, res, next) => {};

const deleteJeu = async (req, res, next) => {};

export default {
  getAllJeux,
  getJeuxById,
  addJeu,
  updateJeu,
  deleteJeu,
};
