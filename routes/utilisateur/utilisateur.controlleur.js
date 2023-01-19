const pool = require('../../db')
const bcrypt = require('bcrypt')

//!Get Allutilisateur
exports.getAllUtilisateur = 
async(req,res) => {
    try {
        const allUsers = await pool.query(
            'SELECT * FROM utilisateur'
        )
        res.json(allUsers.rows)
        console.log(allUsers.rows);
        
    } catch (err) {
        console.warn(err.message);
    }
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
        res.json(loginUser.rows[0])
    } catch (err) {
        console.warn(err.message);
    }
};


//!UPDATE utilisateur
exports.updateUtilisateur = 
async (req,res)=>{
    try {
        const {id} = req.params
        const {user_firstname,user_lastname,user_mail, user_mdp, statut} = req.body;

        const updateUtilisateur = pool.query(
            'UPDATE utilisateur SET user_firstname= $1, user_lastname= $2,user_mail= $3, user_mdp= $4, statut= $5 WHERE id_user= $6 RETURNING *',[user_firstname,user_lastname,user_mail, user_mdp, statut,id]
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

        const deleteUtilisateur = pool.query(
            'DELETE FROM utilisateur WHERE id_user = $1', [id]
        );
        res.json('user deleted successfully!')

    } catch (err) {
        console.warn(err.message);
    }
};

