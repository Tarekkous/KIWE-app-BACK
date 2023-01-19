const express = require('express')
const routerEntreprise = express.Router()
const {deleteEntreprise,updateEntreprise,getAllEntreprises,getOneEntreprise,postEntreprise} = require('./entreprise.controlleur')



//!CRUD entreprise
routerEntreprise
.route('/entreprise')
    .post(postEntreprise)
    .get(getAllEntreprises)
routerEntreprise
.route('/entreprise/:id')
    .get(getOneEntreprise)
    .put(updateEntreprise)
    .delete(deleteEntreprise)









module.exports = routerEntreprise
