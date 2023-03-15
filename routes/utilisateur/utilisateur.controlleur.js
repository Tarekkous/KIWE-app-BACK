const pool = require('../../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 
require('dotenv').config()

//!Get Allutilisateur
exports.getAllUtilisateur = 
async(req,res) => {
    try {
        const allUsers = await pool.query(
            'SELECT * FROM utilisateur'
        )
        
        res.json(allUsers.rows)
         const usersFiltred = allUsers.rows.filter(post => post.user_mail === req.user.name.user_mail)
        console.log(usersFiltred);
        
    } catch (err) {
        console.warn(err.message);
    }
};


//! Function for VERIFY a TOKEN 
exports.authFct = (authenticateToken)
function authenticateToken (req,res,next) {
    const authHeader = req.headers['authorization']
    console.log(req.headers);
    // const TOKEN = authHeader
    const TOKEN = authHeader && authHeader.split(' ')[1] 
    console.log('voici le TOKEN : ' ,TOKEN);
    if (TOKEN == null) return res.sendStatus(401)
    // 401 unauthorized 
    jwt.verify(TOKEN, process.env.ACCESS_TOKEN_SECRET , (err,data)=>{
      if(err) return res.sendStatus(403)
      // 403 Forbidden 
      req.user = data
      console.log('ici USER == > ' ,data);
      next()  
    })
  };
//!GET one utilisateur
exports.getOneUtilisateur = 
async(req,res) => {
    try {
        const {id} = req.params
        const oneUtilisateur = await pool.query(
            'SELECT * FROM utilisateur WHERE id_user =$1', [id]
        )
        res.json(oneUtilisateur.rows);
        
    } catch (err) {
        console.warn(err.message);
    };
};


//!POST utilisateur
exports.postUtilisateur = 
async (req,res) => {
    try {
        const {user_firstname,user_lastname,user_mail, user_mdp, statut} = req.body;
        //!hachage du mot de passe 
        const haschedPassword = await bcrypt.hash(user_mdp,10)
        console.log(haschedPassword);
        const ajoutUtilisateur = await pool.query (
            'INSERT INTO utilisateur (user_firstname,user_lastname,user_mail,user_mdp,statut) VALUES ($1,$2,$3,$4,$5)',[user_firstname,user_lastname,user_mail, haschedPassword, statut]
        );
        res.json('user Added Successfully')
    } catch (err) {
        console.warn(err.message);
    }
};

//!POST login
exports.postLogin = 
async(req,res)=>{
    try {
        const {user_mdp,user_mail} = req.body
        const loginUser = await pool.query(
            'SELECT * FROM utilisateur WHERE user_mail=$1',[user_mail]
        );
            console.log(loginUser.rows[0]);
        // on vérifie si on reçoit le compte de l'utilisateur
        if (loginUser.rows.length === 0) return res.status(401).send('invalid mail')
        //on compare le mot de passe de base avec le mot de passe haché
        const validpassword = await bcrypt.compare(user_mdp,loginUser.rows[0].user_mdp)
        if (!validpassword) return res.status(400).send('invalid password')
        //!générer le TOKEN
        const username = {name : req.body}
        const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)
        res.json({loginUser:loginUser.rows[0],accessToken:accessToken});
    } catch (err) {
        console.warn('erreur : ' ,err.message);
         res.status(401).send("Please use another mail Adress");

    }
};


//!UPDATE utilisateur
exports.updateUtilisateur = 
async (req,res)=>{
    try {
        const {id} = req.params
        const {user_firstname,user_lastname,user_mail, user_mdp, statut} = req.body;
        const password = await bcrypt.hash(user_mdp,10)

        const updateUtilisateur =await pool.query(
            'UPDATE utilisateur SET user_firstname= $1, user_lastname= $2,user_mail= $3, user_mdp= $4, statut= $5 WHERE id_user= $6 RETURNING *',[user_firstname,user_lastname,user_mail, password, statut,id]
        );
        res.json(updateUtilisateur.rows)

    } catch (err) {
        console.warn(err.message);
    }
};

// //!DELETE utilisateur
exports.deleteUtilisateur = 
async (req,res)=>{
    try {
        const {id} = req.params

        const deleteUtilisateur =await pool.query(
            'DELETE FROM utilisateur WHERE id_user = $1', [id]
        );
        res.json('user deleted successfully!')

    } catch (err) {
        console.warn(err.message);
    }
};

//************** *//***************** */

// !Ajout de position de l'utilisateur parmi la file d'attente
exports.addPosition = 
async(req,res)=>{
    try {
        const {user_mail} = req.body
        const addPos = await pool.query(
            'UPDATE utilisateur SET position =((SELECT nombre_clients_en_attente FROM entreprise WHERE USER_MAIL = $1 LIMIT 1)+ 1) WHERE user_mail = $1', [user_mail]
            
        )
        res.json('User position Added!')
    } catch (err) {
        console.warn(err.message);
    }
};


//! Associer l'utilisateur à l'entreprise visité
exports.userAssociate = 
async(req,res)=>{
    try {
        const {nom_entreprise,user_mail} = req.body
        const userAssociated = await pool.query(
            'UPDATE utilisateur  SET id_entreprise = (SELECT ID_ENTREPRISE FROM entreprise WHERE nom_entreprise = $1) WHERE user_mail =$2',[nom_entreprise,user_mail])
        
            res.json('User associated correctly')
    } catch (err) {
        console.log(err.message);
    }
};
//! Dissocier l'utilisateur de l'entreprise visité
exports.userDissociated = 
async(req,res)=>{
    try {
        const {user_mail} = req.body
        const userDissociated = await pool.query(
            'UPDATE utilisateur  SET id_entreprise = NULL WHERE user_mail =$1',
            [user_mail]
        )
        res.json('User dissociated correctly!')
    } catch (err) {
        console.log(err.message);
    }
};



//Admin !!!!! *************************************************************


//!POST loginAdmin
//authentification sécurisé (connexion) de l'administrateur
exports.loginAdmin = 
async(req,res)=>{
    try {
        const {user_mdp,user_mail} = req.body
        const loginAdmin = await pool.query(
            'SELECT * FROM utilisateur WHERE user_mail=$1',[user_mail]
        )
            console.log(loginAdmin.rows[0]);
        // on vérifie si on reçoit le compte de l'utilisateur
        if (loginAdmin.rows.length === 0) return res.status(401).send('invalid mail')
        //on compare le mot de passe de base avec le mot de passe haché
        const validpassword = await bcrypt.compare(user_mdp,loginAdmin.rows[0].user_mdp)
        if (!validpassword) return res.status(400).send('invalid password')
         const statut = loginAdmin.rows[0].statut;
            //on vérifie si l'utilisateur est un commerçant
         if (statut !== 'commerçant') {
        return res.json({ message: 'Accès refusé' });
    }
        //!générer le TOKEN
        const username = {name : req.body}
        const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)
        res.json({loginAdmin:loginAdmin.rows[0],accessToken:accessToken});
    } catch (err) {
        console.warn('erreur : ' ,err.message);
         res.status(401).send("Please use another mail Adress");

    }
};

//!get all clients

//récupérer tout les clients appartenants à l'entreprise de l'admin en fonction de son ID
exports.getClients =
async (req,res)=>{
    try {
      const {id} = req.params  
      const getAllClients = await pool.query(
        'SELECT * FROM utilisateur WHERE statut = $1 AND id_entreprise = $2 AND position IS NOT NULL ',['client',id]
      );
      
      console.log(getAllClients.rows[0]);

      res.json(getAllClients.rows)
    } catch (err) {
        console.warn(err.message);
    }
};

// !Enlever position de l'utilisateur parmi la file d'attente
exports.removePosition = 
async(req,res)=>{
    try {
        const {user_mail} = req.body
        const removePos = await pool.query(
            'UPDATE utilisateur SET position = 0 WHERE user_mail = $1', [user_mail]
        )
        res.json('User position Removed!')
    } catch (err) {
        console.warn(err.message);
    }
}













