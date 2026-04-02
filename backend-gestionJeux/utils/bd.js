import mongoose from "mongoose";

let connection = false;

export const connectDB = async () => {
  if (connection) return;
  let uri = "mongodb://localhost:27017/MohamadElhajj_BD";
  try {
    await mongoose.connect(uri);
    connection = true;
    console.log("Connexion MongoDB réussie");
  } catch (e) {
    console.error("Erreur de connexion MongoDB :", e.message);
    process.exit(1);
  }
};
