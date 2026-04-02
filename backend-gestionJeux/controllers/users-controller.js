import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../utils/http-error.js";

const inscription = async (req, res, next) => {
  const { name, email, password, role, jeux } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    console.log(e);
    const erreur = new HttpError(
      "Enregistrement échoué, veuillez réessayer plus tard.",
      500,
    );
    return next(erreur);
  }
  console.log("existingUser", existingUser);
  if (existingUser) {
    const erreur = new HttpError(
      "Un utilisateur avec cette adresse e-mail existe déjà. ",
      422,
    );
    return next(erreur);
  }
  const createdUser = new User({
    name,
    email,
    password,
    role,
    jeux,
  });
  console.log("createdUser", createdUser);
  try {
    await createdUser.save();
  } catch (e) {
    console.log(e);
    const erreur = new HttpError(
      "Enregistrement échoué, veuillez réessayer plus tard.",
      500,
    );
    return next(erreur);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const connexion = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (e) {
    console.erreur(e);
    const erreur = new HttpError(
      "Échec de connexion, veuillez réessayer plus tard.",
      500,
    );
    return next(erreur);
  }
  if (!existingUser || existingUser.password !== password) {
    const erreur = new HttpError(
      "Identification échouée, vérifiez vos identifiants.",
      401,
    );
    return next(erreur);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "cleSuperSecrete!",
      { expiresIn: "1h" },
    );
  } catch (e) {
    const erreur = new HttpError(
      "Erreur lors de la génération du jeton. Réessayer plus tard. ",
      500,
    );
    return next(erreur);
  }
  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
  });
};

export default {
  inscription,
  connexion,
};
