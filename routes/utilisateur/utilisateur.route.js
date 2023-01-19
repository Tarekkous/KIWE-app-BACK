const express = require('express')
const routerUtilisateur = express.Router()
const {authFct,postLogin,deleteUtilisateur,updateUtilisateur,getOneUtilisateur,getAllUtilisateur, postUtilisateur} = require('./utilisateur.controlleur')



//!CRUD entreprise
routerUtilisateur
.route('/user')
    .get(authFct,getAllUtilisateur)
    .post(postUtilisateur)
routerUtilisateur
.route('/user/:id')
    .get(getOneUtilisateur)
    .put(updateUtilisateur)
    .delete(deleteUtilisateur)
routerUtilisateur
    .route('/login')
    .post(postLogin)











module.exports = routerUtilisateur
