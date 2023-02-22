const express = require('express')
const routerEntreprise = express.Router()
const {reduceTimeCompany,removeClient,addClient,updateTimeAll,deleteEntreprise,updateEntreprise,getAllEntreprises,getOneEntreprise,postEntreprise} = require('./entreprise.controlleur')



//!CRUD entreprise
routerEntreprise
.route('/entreprise')
    .post(postEntreprise)
    .get(getAllEntreprises)
    //calcul temps d'attente 
    .put(updateTimeAll)
routerEntreprise
.route('/entreprise/:id')
    .get(getOneEntreprise)
    .put(updateEntreprise)
    .delete(deleteEntreprise)
routerEntreprise
    //on ajoute un client & +2min d'attente
.route('/entrepriseAddClient')
    .put(addClient)
routerEntreprise
    //on enlève un client &  -2min temps d'attente
    .route('/entrepriseReload')
        .put(removeClient)
    
routerEntreprise
        //on enlève -2min temps d'attente
        .route('/company/:id')
            .put(reduceTimeCompany)








module.exports = routerEntreprise
