var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


/***************************************/
/******* Partie Basse de donnée ********/
/***************************************/

/* Connection à notre Base de donnée */
var options = { server: { socketOptions: {connectTimeoutMS: 5000 } }};
mongoose.connect('mongodb://pierrot38:montoto38@ds147469.mlab.com:47469/suggardoggy',
    options,
    function(err)
    { console.log("ACCES BDD", err); }
);

/****** Création de notre Base de donnée **********/
var shopsSchema = mongoose.Schema(
{
    raisonSociale: String,
    specialite: String,
    adresse: String,
    ville: String,
    cp: Number,
    image: String,
    descriptif: String
});
var shopsModel = mongoose.model('shops', shopsSchema);

var produitsSchema = mongoose.Schema(
{
    nom: String,
    prix: Number,
    allergies: String,
    nombre: Number,
    shopsId: String,

});
var produitsModel = mongoose.model('produits', produitsSchema);

var commandesSchema = mongoose.Schema(
{

    prixTotal: Number,
    prixLivraison: Number,
    etatPaiement: String,
    clientsNom: String,
    clientsPrenom: String,
    clientsAdresse: String,
    clientsVille: String,
    clientsCp: Number

});
var commandesModel = mongoose.model('commandes', commandesSchema);

var commProduitsSchema = mongoose.Schema(
{
    produitsNom: String,
    produitsPrix: Number,
    nombre: Number,
    commandeId: String

});
var commProduitsModel = mongoose.model('commandesproduits', commProduitsSchema);


/***************************************/
/********* GESTION DES ROUTER **********/
/***************************************/
  var shopsData = [];
  //var productsData = [];
var panierClient = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/repertoire', function(req, res, next) {
  res.render('repertoire');
});

router.get('/shop', function(req, res, next) {
  produitsModel.find(
    { shopsId: '5ad8938761fd9e070ca5c400' }, // ATTENTION PENSEZ À CHANGER L'ID QUAND LA PAGE REPETOIRE SERA FINI
  function(err, products){
    //console.log(products);
    res.render('shop', { productList: products, panierClient: panierClient } );
  });
});

router.get('/add-shop-product', function(req, res, next){
  produitsModel.find(
    { _id: req.query.id },
    function( err, product ){
      panierClient.push({
        nom: product[0].nom,
        prix: product[0].prix,
        nombre: product[0].nombre
      });
      console.log(panierClient);
      res.redirect('/shop');
    }
  )
});





router.get('/basket', function(req, res, next) {
  res.render('basket');
});


router.get('/confirmation', function(req, res, next) {
  res.render('confirmation');
});

module.exports = router;
