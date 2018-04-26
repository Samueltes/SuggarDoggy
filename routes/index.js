var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var stripe = require('stripe')('sk_test_fnkzrCVoI3J5ICXoOud11G2H');






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
    siret: String,
    raisonSociale: String,
    specialite: String,
    adresse: String,
    ville: String,
    cp: Number,
    email: String,
    password: String,
    tel: String,
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


var clientsSchema = mongoose.Schema(
{
    email: String,
    password: String,
    nom: String,
    prenom: String,
    adresse: String,
    ville: String,
    cp: Number
});
var clientsModel = mongoose.model('clients', clientsSchema);



/***************************************/
/********* GESTION DES ROUTER **********/
/***************************************/


/* page index */
router.get('/', function(req, res, next)
{
  res.render('index');
});


/*page repertoire*/
router.post('/repertoire', function(req, res, next)
{
      if ( req.body.specialite == "Toutes" || req.body.specialite == "Quoi donc ?" )
      {

          shopsModel.find(
          { ville: req.body.ville },
               function (error, shops)
               {
                   res.render('repertoire', { shops });
               }
          )

      }
      else
      {
          shopsModel.find(
          { specialite: req.body.specialite, ville: req.body.ville },
               function (error, shops)
               {
                   res.render('repertoire', { shops });
               }
          )

      }

});




router.post('/livraison', function(req, res, next)
{
      var envoiform    = req.body.envoiform;
      var livnom       = req.body.livnom;
      var livprenom    = req.body.livprenom;
      var livadresse   = req.body.livadresse;
      var livcp        = req.body.livcp;
      var livville     = req.body.livville;


      var commandesModelA = new commandesModel (
      {
          prixTotal: 0,
          prixLivraison: 0,
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
                req.session.idNewCmd = commande._id;

                shopsModel.find(
                { _id: req.session.idShopSelect },
                  function (error, shop)
                  {
                      res.render('basket', { shop, envoiform, livnom, livprenom, livadresse, livcp, livville, panierClient: req.session.basketByShop , deliveryAndTotalOrder : req.session.deliveryAndTotalOrder });
                  }
                )
          }
      );

});


router.get('/shop-selected', function(req, res, next)
{
  req.session.idShopSelect = req.query.idShop;
  res.redirect('/shop');
});


/* page shop */
router.get('/shop', function(req, res, next)
{

  if(req.session.commandeProduits === undefined)
  {
    req.session.commandeProduits = [];
  }

  shopsModel.find(
    { _id: req.session.idShopSelect },
    function(err, shops)
    {

      produitsModel.find(
        { shopsId: req.session.idShopSelect },
        function(err, products){


          /*** Panier unique pour chaque shop + calcule du total et de la livraison  ***/
          req.session.basketByShop = [];
          req.session.total = 0;
          for(let i=0; i < req.session.commandeProduits.length; i++)
          {
            if(req.session.idShopSelect === req.session.commandeProduits[i].idShop )
            {

              // Panier unique
              req.session.basketByShop.push({
                nom : req.session.commandeProduits[i].nom,
                nombre : req.session.commandeProduits[i].nombre,
                prix : req.session.commandeProduits[i].prix
              })

              //Calcule du total & de la livraison
              req.session.total = req.session.total + req.session.commandeProduits[i].prix;
              //console.log(req.session.total);
            }
            else
            {
              total = 0;
            }
          }
          /****/

          /* total et livraison mise en session*/
          req.session.deliveryAndTotalOrder =
          {
            totalCmd : req.session.total,
            livraison : 2,
            totalCmdDelivery : req.session.total + 2
          };

          res.render('shop', { productList: products, panierClient: req.session.basketByShop, infosShop : shops, deliveryAndTotalOrder  : req.session.deliveryAndTotalOrder   } );
      });

    });
});


router.get('/add-shop-product', function(req, res, next)
{
  produitsModel.find(
    { _id: req.query.id },
    function( err, product )
    {

      req.session.commandeProduits.push(
      {
        nom: product[0].nom,
        prix: product[0].prix,
        nombre: product[0].nombre,
        idProduct : product[0].id,
        idShop : product[0].shopsId
      });

      res.redirect('/shop');
    }
  )
});


router.get('/delete-shop-product', function(req, res, next)
{
  req.session.commandeProduits.splice(req.query.position, 1);
  res.redirect('/shop');
});

router.get('/validation-commande', function(req, res, next)
{
  res.redirect('basket');
});


/* page basket */
router.get('/basket', function(req, res, next)
{

  shopsModel.find(
    { _id: req.session.idShopSelect },
    function (error, shop)
    {
        res.render('basket', { shop, panierClient: req.session.basketByShop , deliveryAndTotalOrder : req.session.deliveryAndTotalOrder });
    }
  )
});


router.post('/checkout',function(req, res, next)
{

  //Recupération du total de la commande (*100) pour le payement stripe
  var aPayer = req.session.deliveryAndTotalOrder.totalCmdDelivery*100;

  commandesModel.update(
  { _id: req.session.idNewCmd },
   {
      prixTotal: req.session.deliveryAndTotalOrder.totalCmd,
      prixLivraison: req.session.deliveryAndTotalOrder.livraison,
      etatPaiement: "Payé"
   },
   function(error, row ){

     // Voir les changements dans un console.log
     commandesModel.find(
       { _id: req.session.idNewCmd },
       function(err, commande)
       {
         console.log('Commande aprés modification : ' + commande);
       }
     );
     //**
   }
  );

  //console.log('ID trouver ou non : '+req.session.idNewCmd);
  if (req.session.idNewCmd === undefined){

    console.log('oui');
    res.redirect('/basket');

  } else {

    //Payement sur stripe
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    }).then(function(customer){
      return stripe.charges.create({
        amount: aPayer,
        currency: 'eur',
        customer: customer.id
      });
    }).then(function(charge){
      console.log('Payement effectué !');
      res.redirect('/confirmation');
    }).catch(function(err){
      console.log(err);
    })

  }

});



/* page confirmation */
router.get('/confirmation', function(req, res, next)
    {
                shopsModel.find(
                { _id: req.session.idShopSelect },

                  function (error, shop)
                  {
                      commandesModel.find(
                      { _id: req.session.idNewCmd },

                        function (error, commande)
                        {
                             console.log("page confirmation, la commande :" + commande);
                             res.render('confirmation', { shop, commande, panierClient: req.session.basketByShop , deliveryAndTotalOrder : req.session.deliveryAndTotalOrder });
                        }
                      );

                  }
                );
    }

);



/*page repertoire*/
router.get('/partner', function(req, res, next)
{
      shopsModel.find(
   // { _id: req.session.idShopForPartner },
      { _id: "5ae0b7373220b7365cfd103d" },
        function (error, shop)
        {
              produitsModel.find(
              { shopsId: shop[0]._id },
                  function (error, productList)
                  {
                       res.render('partner', { shop, productList });
                  }
              );

        }
      );

});


router.post('/addProduct', function(req, res, next){

  var newProduit = new produitsModel ({
    nom: req.body.prodquantite+' x '+req.body.prodnom,
    prix: req.body.prodprix,
    allergies: req.body.prodallergenes,
    nombre: req.body.prodnombre,
    shopsId: req.session.idShopForPartner
  });
  newProduit.save(
    function(err, produit){
      console.log(produit);
      res.redirect('/partner');
  });

});




router.post('/updateShop', function(req, res)
{

//
// console.log("UPDATE !!!!!!!!!!!!!");
// console.log("SHOPID: " + req.body.shopid);
// console.log("TYPE DE UPLOAD: " + req.files.shopimage.mimetype);
//
  if(req.files.shopimage === undefined)
  {
      var nomfichierimage='imagepardefaut.png';
  }
  else
  {

      if ( req.files.shopimage.mimetype.indexOf(".png"))
      {
          var nomfichierimage='im' + req.body.shopid + '.png';
      }
      else
      {
          if ( req.files.shopimage.mimetype.indexOf(".jpg"))
          {
              var nomfichierimage='im' + req.body.shopid + '.jpg';
          }
          else
          {
              if ( req.files.shopimage.mimetype.indexOf(".gif"))
              {
                  var nomfichierimage='im' + req.body.shopid + '.gif';
              }
          }
      }

  }


  shopsModel.find(
      { _id:req.body.shopid },
      function (err, shop1)
      {

             shopsModel.update(
             {    _id:req.body.shopid },
             {
                  siret: req.body.shopsiret,
                  raisonSociale: req.body.shopraisonSociale,
                  specialite: req.body.shopspecialite,
                  adresse: req.body.shopadresse,
                  ville: req.body.shopville,
                  cp: req.body.shopcp,
                  email: shop1[0].email,
                  password: shop1[0].password,
                  tel: req.body.shoptel,
                  image: nomfichierimage,
                  descriptif: req.body.shopdescriptif
             },
             function (err, raw)
             {

                  shopsModel.find(
                  { _id:req.body.shopid },
                  function (err, shop)
                  {

                        produitsModel.find(
                        { shopsId: shop[0]._id },
                            function (error, productList)
                            {
                                    if ( req.files && (req.files.shopimage !== undefined) )
                                    {

                                        // The name of the input field is used to retrieve the uploaded file
                                        let sampleFile = req.files.shopimage;

                                        // Use the mv() method to place the file somewhere on your server
                                        sampleFile.mv("C:/Users/pierr/lacapsule/sugar/SuggarDoggy/SuggarDoggy/public/images/" + nomfichierimage , function(err)
                                        {
                                            if (err)
                                            {
                                               return res.status(500).send(err);
                                            }

                                            res.render('partner', { shop, productList });
                                        });


                                    }
                                    else
                                    {
                                        res.render('partner', { shop, productList });
                                    }


                            }
                        );


                  });
             });


      }

  );


});






//
//
// router.post('/updateShop', function(req, res, next)
// {
//   //console.log("UPDATE !!!!!!!!!!!!!");
//   //console.log("SHOPID: " + req.body.shopid);
//   shopsModel.find(
//       { _id:req.body.shopid },
//       function (err, shop1)
//       {
//         //console.log("SHOP: " + shop1);
//              shopsModel.update(
//              {    _id:req.body.shopid  },
//              {
//                   siret: req.body.shopsiret,
//                   raisonSociale: req.body.shopraisonSociale,
//                   specialite: req.body.shopspecialite,
//                   adresse: req.body.shopadresse,
//                   ville: req.body.shopville,
//                   cp: req.body.shopcp,
//                   email: shop1[0].email,
//                   password: shop1[0].password,
//                   tel: req.body.shoptel,
//                   image: req.body.shopimage,
//                   descriptif: req.body.shopdescriptif
//              },
//              function (err, raw)
//              {
//                res.redirect('/partner');
//              });
//       }
//   );
// });
//

router.get('/deleteProduct', function(req, res, next)
{
   produitsModel.remove(
   { _id:req.query.id },
   function(err)
   {
     res.redirect('/partner')
   });
});

router.post('/deconnexionPartner', function(req, res, next){
  req.session.idShopForPartner = undefined;
  res.render('index');
});


/* page connexion de partenaire */
router.get('/connexion-partner', function(req, res, next)
{

  /* Le shop n'a pas besion de se reconnecter si il ne s'est pas déconnecter avant */
  if( req.session.idShopForPartner===undefined ) {
    res.render('connexion-partner', { mdpPartnerIsFalse: req.session.mdpPartnerIsFalse });
  } else {
    res.redirect('/partner');
  }

});


router.post('/connexionForPartner', function(req, res, next){

  shopsModel.find(
    {
      email: req.body.email,
      password: req.body.mdp
    },
    function(err, shops){

      /* Gére deux réponses différents si les identifiants sont bons ou non */
      if (shops[0]){
        //console.log('Identifiant OK, je me connecte.');
        req.session.idShopForPartner = shops[0]._id;
        res.redirect('/partner');
      } else {
        req.session.mdpPartnerIsFalse = true;
        //console.log('Mauvaise identifiant, je ne me connecte pas.');
        res.redirect('/connexion-partner');
      }

    }
  );
});


/* Connexion Client */
router.post('/signupClient', function(req, res, next) {

  clientsModel.find(
      { email:req.body.email, password:req.body.password },
      function (err, client)
      {
          if(client.length == 0)
          {

             var clientsModelA = new clientsModel (
             {
                email: req.body.email,
                password: req.body.password,
                nom: req.body.nom,
                prenom: req.body.prenom,
                adresse: req.body.adresse,
                ville: req.body.ville,
                cp: req.body.cp


             });
             clientsModelA.save(

                function (error, user)
                {
                     res.render('loginClient');

                }

             );


          }
          else
          {
                res.render('signupClient');
          }
      }

  );


});



module.exports = router;
