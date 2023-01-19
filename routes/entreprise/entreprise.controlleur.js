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

        const updateEntreprise = pool.query(
            'UPDATE entreprise SET nom_entreprise = $1,nombre_clients_en_attente = $2,temps_attente = $3 WHERE id_entreprise = $4 RETURNING *',[ nom_entreprise,nombre_clients_en_attente,temps_attente,id]
        );
        res.json(updateEntreprise.rows)

    } catch (err) {
        console.warn(err.message);
    }
};


//!DELETE entreprise
exports.deleteEntreprise = 
async (req,res)=>{
    try {
        const {id} = req.params

        const updateEntreprise = pool.query(
           'DELETE FROM entreprise WHERE id_entreprise = $1', [id]
        );
        res.json('Deleted successfully!')

    } catch (err) {
        console.warn(err.message);
    }
};
