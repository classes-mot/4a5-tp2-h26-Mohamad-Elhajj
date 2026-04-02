import mongoose from "mongoose";

const jeuSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  categorie: { type: String, required: true },
  duree: Number,
  nbrJoueur: String,
  assignee: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const Jeu = mongoose.model("Jeu", jeuSchema);
