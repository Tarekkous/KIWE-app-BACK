const pool = require('../../db')


//!Get one entreprise
exports.getOneEntreprise = 
async(req,res) => {
    try {
        const {id} = req.params
        const oneEntreprise = await pool.query(
            'SELECT * FROM entreprise WHERE id_entreprise =$1', [id]
        )
        res.json(oneEntreprise.rows);
        // console.log(allEntreprises.rows);
        
    } catch (err) {
        console.warn(err.message);
    };
};

//!GET all entreprises
exports.getAllEntreprises = 
async(req,res) => {
    try {
        const allEntreprises = await pool.query(
            'SELECT * FROM entreprise'
        )
        res.json(allEntreprises.rows);
        
    } catch (err) {
        console.warn(err.message);
    };
};

//!POST entreprise
exports.postEntreprise = 
async (req,res) => {
    try {
        const {nom_entreprise,nombre_clients_en_attente,temps_attente} = req.body;
        const ajoutEntreprise = await pool.query (
            'INSERT INTO entreprise (nom_entreprise,nombre_clients_en_attente,temps_attente) VALUES ($1,$2,$3)',[nom_entreprise,nombre_clients_en_attente,temps_attente]
        );
        res.json('Society Added successfully')
    } catch (err) {
        console.warn(err.message);
    }
};

//!UPDATE entreprise
exports.updateEntreprise = 
async (req,res)=>{
    try {
        const {id} = req.params
        const {nom_entreprise,nombre_clients_en_attente,temps_attente} = req.body;

        const updateEntreprise =await pool.query(
            'UPDATE entreprise SET nom_entreprise = $1,nombre_clients_en_attente = $2,temps_attente = $3 WHERE id_entreprise = $4 RETURNING *',[ nom_entreprise,nombre_clients_en_attente,temps_attente,id]
        );
        res.json("updated")

    } catch (err) {
        console.warn(err.message);
    }
};


//!DELETE entreprise
exports.deleteEntreprise = 
async (req,res)=>{
    try {
        const {id} = req.params

        const updateEntreprise =await pool.query(
           'DELETE FROM entreprise WHERE id_entreprise = $1', [id]
        );
        res.json('Deleted successfully!')

    } catch (err) {
        console.warn(err.message);
    }
};

 // *******//************* */********************* */


//Si temps d'attente par client = 2min , Calcul de temps d'attente :
//!temps d'attente CALCUL for all societies
exports.updateTimeAll = 
async(req,res)=>{
    try {
        const updateTimeAll = await pool.query(
            'UPDATE entreprise SET temps_attente = ( nombre_clients_en_attente * 2 )'
        )
        res.json('waiting_time updated successfully')
    } catch (err) {
        console.warn(err.message);
    }
};
//!Si le user décide d'attendre , on ajoute un client + 2min d'attente
exports.addClient = 
async(req,res)=>{
    try {
     const {user_mail} = req.body
     const addClient = await pool.query(
        'UPDATE ENTREPRISE SET NOMBRE_CLIENTS_EN_ATTENTE = NOMBRE_CLIENTS_EN_ATTENTE + 1 WHERE ID_ENTREPRISE IN (SELECT ID_ENTREPRISE FROM UTILISATEUR WHERE USER_MAIL = $1)',[user_mail]).then(()=>{
            const updateTime = pool.query(
                'UPDATE entreprise SET temps_attente = ( nombre_clients_en_attente * 2 + 2 ) WHERE id_entreprise = (SELECT ID_ENTREPRISE FROM UTILISATEUR WHERE USER_MAIL = $1)',[user_mail]
            )
     res.json('Client added + Time added ')

        });
    } catch (err) {
        console.warn(err.message);
    }
};
//!Si le user décide de quitter ou a fini , on enléve un client + temps d'attente diminue de 2min
//ensuite on le dissocie de l'entreprise(voir utilisateur-controlleur)
exports.removeClient = 
async(req,res)=>{
    try {
     const {user_mail} = req.body
     const removeClient = await pool.query
     ('UPDATE ENTREPRISE SET NOMBRE_CLIENTS_EN_ATTENTE = NOMBRE_CLIENTS_EN_ATTENTE - 1 WHERE ID_ENTREPRISE IN (SELECT ID_ENTREPRISE FROM UTILISATEUR WHERE USER_MAIL = $1)',[user_mail]).then(()=>{
        const timeReduce = pool.query(
            'UPDATE entreprise SET temps_attente = (nombre_clients_en_attente * 2 - 2) WHERE ID_ENTREPRISE = (SELECT ID_ENTREPRISE FROM UTILISATEUR WHERE USER_MAIL = $1)',[user_mail]
        )
     res.json('Client removed + time reduced!')
     });
    } catch (err) {
        console.warn(err.message);
    }
};


