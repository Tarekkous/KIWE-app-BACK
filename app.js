const express = require("express");
const app = express();
const cors = require("cors");

//socket IO
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);


// les routes 
const routerUtilisateur = require('../Server/routes/utilisateur/utilisateur.route')
const routerEntreprise = require('../Server/routes/entreprise/entreprise.route')

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routerUtilisateur)
app.use(routerEntreprise)





app.get('/',(req,res)=>{
    res.send('Hello!');
});








const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("server is running!");
});