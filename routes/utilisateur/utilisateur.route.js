const express = require("express");
const routerUtilisateur = express.Router();
const {
  removePosition,
  getClients,
  loginAdmin,
  addPosition,
  userDissociated,
  userAssociate,
  authFct,
  postLogin,
  deleteUtilisateur,
  updateUtilisateur,
  getOneUtilisateur,
  getAllUtilisateur,
  postUtilisateur,
} = require("./utilisateur.controlleur");

//!CRUD entreprise in client mode
routerUtilisateur
  .route("/user")
  .get(authFct, getAllUtilisateur)
  .post(postUtilisateur)
  // associer l'utilisateur à l'entreprise consulté par ce dernier en fonction de son mail
  .put(userAssociate);
routerUtilisateur
  // Dissocier l'utilisateur de l'entreprise consulté par ce dernier en fonction de son mail
  .route("/userDissociate")
  .put(userDissociated);

routerUtilisateur
  // on ajoute une position à l'utilisateur en fonction de nombre de clients
  .route("/addPos")
  .put(addPosition);

routerUtilisateur
  .route("/user/:id")
  .get(getOneUtilisateur)
  .put(updateUtilisateur)
  .delete(deleteUtilisateur);
routerUtilisateur.route("/login").post(postLogin);

//! CRUD entreprise in ADMIN mode !!!! ****
routerUtilisateur.route("/loginAdmin").post(loginAdmin);

routerUtilisateur.route("/clients/:id").get(getClients);
routerUtilisateur.route("/posClient").put(removePosition);

module.exports = routerUtilisateur;
