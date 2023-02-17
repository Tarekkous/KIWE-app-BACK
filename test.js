// Importation des modules nécessaires
const express = require('express');
const router = express.Router();
const db = require('../db'); // Importez votre module de base de données ici
const jwt = require('jsonwebtoken');
const config = require('../config'); // Importez votre fichier de configuration ici

// Route pour obtenir les données nécessaires pour afficher la vue administrateur
router.get('/admin', verifyToken, (req, res) => {
  // Vérifiez si l'utilisateur est un commerçant
  const userId = req.userId;
  db.query('SELECT STATUT FROM UTILISATEUR WHERE ID_USER = $1', [userId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur interne du serveur' });
    }

    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const statut = results.rows[0].STATUT;

    if (statut !== 'COMMERÇANT') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Si l'utilisateur est un commerçant, renvoyer les données nécessaires pour afficher la vue administrateur
    db.query('SELECT * FROM ENTREPRISE WHERE ID_ENTREPRISE = $1', [req.query.idEntreprise], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
      }

      if (results.rows.length === 0) {
        return res.status(404).json({ message: 'Entreprise non trouvée' });
      }

      const entreprise = results.rows[0];
      return res.json(entreprise);
    });
  });
});

// Fonction pour vérifier si l'utilisateur a un jeton valide
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur interne du serveur' });
    }

    req.userId = decoded.id;
    next();
  });
}

module.exports = router;
