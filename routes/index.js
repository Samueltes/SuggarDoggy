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


/* page index */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/*page repertoire*/
router.post('/repertoire', function(req, res, next){
      console.log( req.body.specialite + req.body.ville );
      shopsModel.find(
      { specialite: req.body.specialite, ville: req.body.ville },
           function (error, shops)
           {
               //console.log(shops);
               res.render('repertoire', { shops });
           }
      )
});




router.post('/livraison', function(req, res, next) 
{
      console.log( req.body.livnom + req.body.livprenom );

      var envoiform    = req.body.envoiform;
      var livnom       = req.body.livnom;
      var livprenom    = req.body.livprenom;
      var livadresse   = req.body.livadresse;
      var livcp        = req.body.livcp;
      var livville     = req.body.livville;

      var commandesModelA = new commandesModel (
      {
          prixTotal: 4.50,
          prixLivraison: 2,
          etatPaiement: "Payé",
          clientsNom: req.body.livnom,
          clientsPrenom: req.body.livprenom,
          clientsAdresse: req.body.livadresse,
          clientsVille: req.body.livville,
          clientsCp: req.body.livcp

      }
      );

      commandesModelA.save(
          function (error, commande) 
          {



                shopsModel.find(
                { _id: req.session.idShopSelect },
       /*         { _id: "5ad8938761fd9e070ca5c400" },  */
                  function (error, shop) 
                  {


                      console.log("MON MAGASIN" + shop);
                      res.render('basket', { shop, envoiform, livnom, livprenom, livadresse, livcp, livville });
                  }
                )


/*              var commProduitsModel4 = new commProduitsModel (
                {
                    produitsNom: "3 x Religieuse",
                    produitsPrix: 4.50,
                    nombre: 2,
                    commandeId: commande._id

                }
                );

                commProduitsModel4.save(
                    function (error, comproduit) 
                    {
                       console.log(comproduit); 
                    }
                );*/


          }
      );






});







router.get('/shop-selected', function(req, res, next){
  req.session.idShopSelect = req.query.idShop;
  res.redirect('/shop');
});


/* page shop */
router.get('/shop', function(req, res, next) {

  if(req.session.panierClient === undefined){
    req.session.panierClient = [];
  }

  shopsModel.find(
    { _id: req.session.idShopSelect },
    function(err, shops){

      produitsModel.find(
        { shopsId: req.session.idShopSelect },
        function(err, products){
          res.render('shop', { productList: products, panierClient: req.session.panierClient, infosShop : shops } );
      });

    });
});

router.get('/add-shop-product', function(req, res, next){
  produitsModel.find(
    { _id: req.query.id },
    function( err, product ){
      req.session.panierClient.push({
        nom: product[0].nom,
        prix: product[0].prix,
        nombre: product[0].nombre,
        idProduct : product[0].id
      });
      res.redirect('/shop');
    }
  )
});

router.get('/delete-shop-product', function(req, res, next){
  req.session.panierClient.splice(req.query.position, 1);
  res.redirect('/shop');
});


/* page basket */
router.get('/basket', function(req, res, next) 
{
  
  shopsModel.find(
    { _id: req.session.idShopSelect },
/*  { _id: "5adcfb5e10e0c52d1c6522d2" },  */ 
    function (error, shop) 
    {


        console.log("MON MAGASIN" + shop);
        res.render('basket', { shop });
    }
  )

 
});




/* page confirmation */
router.get('/confirmation', function(req, res, next) {
  res.render('confirmation');
});

module.exports = router;
