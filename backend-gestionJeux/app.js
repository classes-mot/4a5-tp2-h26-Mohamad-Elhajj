import express from "express";
import usersRoutes from "./routes/users-routes.js";
import jeuxRoutes from "./routes/jeux-routes.js";
import errorHandler from "./handler/error-handler.js";
import { connectDB } from "./utils/bd.js";

await connectDB();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // header et value * quels domaines peuvent acceder a notre serveur
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  ); //quel header sont autorisés ( pourait etre * pour tout)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); // quelles methodes HTTP sont autorisées
  next();
});

app.use("/api/users", usersRoutes);

app.use("/api/jeux", jeuxRoutes);

app.use((req, res, next) => {
  const error = new Error("Route non trouvée");
  error.code = 404;
  next(error);
});

app.use(errorHandler);

app.listen(5000, () => {
  console.log("serveur écoute au", `http://localhost:5000`);
});
