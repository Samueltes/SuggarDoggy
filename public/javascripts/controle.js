

   document.getElementById("btn-shopvalide").addEventListener('click', function(e)
   {
        e.preventDefault();

	      erreur = "";
	      vide  = 0;


        var varshopspecialite =    document.getElementById("shopspecialite").value;
        var varshopraisonSociale = document.getElementById("shopraisonSociale").value;
        var varshopsiret =         document.getElementById("shopsiret").value;
        var varshopadresse =       document.getElementById("shopadresse").value;
        var varshopcp =            document.getElementById("shopcp").value;
        var varshopville =         document.getElementById("shopville").value;
        var varshoptel =           document.getElementById("shoptel").value;
        var varshopimage =         document.getElementById("shopimage").value;
        var varshopdescriptif =    document.getElementById("shopdescriptif").value;

        if ( !varshopspecialite )
        {   if (erreur == "")
            {   erreur = erreur + "spécialité";    }
            else
            {   erreur = erreur + ", spécialité";  }

	          vide = vide + 1;
        }

        if ( !varshopraisonSociale )
        {   if (erreur == "")
            {   erreur = erreur + "raison sociale";    }
            else
            {   erreur = erreur + ", raison sociale";  }

	          vide = vide + 1;
        }


        if ( !varshopsiret )
        {   if (erreur == "")
            {   erreur = erreur + "siret";    }
            else
            {   erreur = erreur + ", siret";  }

	          vide = vide + 1;
        }

        if ( !varshopadresse )
        {   if (erreur == "")
            {   erreur = erreur + "adresse";    }
            else
            {   erreur = erreur + ", adresse";  }

	          vide = vide + 1;
        }

        if ( !varshopcp )
        {   if (erreur == "")
            {   erreur = erreur + "code postal";    }
            else
            {   erreur = erreur + ", code postal";  }

	          vide = vide + 1;
        }

        if ( !varshopville )
        {   if (erreur == "")
            {   erreur = erreur + "ville";    }
            else
            {   erreur = erreur + ", ville";  }

	          vide = vide + 1;
        }

        if ( !varshoptel )
        {   if (erreur == "")
            {   erreur = erreur + "téléphone";    }
            else
            {   erreur = erreur + ", téléphone";  }

	          vide = vide + 1;
        }

        if ( !varshopimage )
        {   if (erreur == "")
            {   erreur = erreur + "image";    }
            else
            {   erreur = erreur + ", image";  }

	          vide = vide + 1;
        }

        if ( !varshopdescriptif )
        {   if (erreur == "")
            {   erreur = erreur + "descriptif";    }
            else
            {   erreur = erreur + ", descriptif";  }

	          vide = vide + 1;
        }


        if ( vide > 0 )
        {
          if ( vide > 2 )
          {
            alert ( "Il y a des champs non remplis." );
          }
          else
          {

            if ( vide == 2 )
            {
              alert ( "Champs non remplis : " + erreur );
            }
            else
            {
              alert ( "Champ non rempli : " + erreur );
            }

          }

        }
        else
        {

          if ( parseInt(varshopsiret) != varshopsiret )
          {
            erreur = "Un siret ne doit contenir que des chiffres";
            alert ( erreur );
          }
          else
          {
            if ( varshopsiret.length != 14 )
            {
              erreur = "Un siret doit contenir 14 chiffres";
              alert ( erreur );
            }
            else
            {
              if ( parseInt(varshopcp) != varshopcp )
              {
                erreur = "Un code postal ne doit contenir que des chiffres";
                alert ( erreur );
              }
              else
              {
                if ( varshopcp.length != 5 )
                {
                  erreur = "Un code postal doit contenir 5 chiffres";
                  alert ( erreur );
                }
                else
                {
                  if ( parseInt(varshoptel) != varshoptel )
                  {
                    erreur = "Un numéro de téléphone ne doit contenir que des chiffres";
                    alert ( erreur );

                  }
                  else
                  {
                    if ( varshoptel.length != 10 )
                    {
                      erreur = "Un numéro de téléphone doit contenir 10 chiffres";
                      alert ( erreur );
                    }
                    else
                    {
                      document.getElementById("formshop").submit();

                    }
                  }

                }
              }

            }
          }

        }


   });







   document.getElementById("btn-prodvalide").addEventListener('click', function(e)
   {
        e.preventDefault();

	      erreur = "";
	      vide  = 0;

        var varprodnom =              document.getElementById("prodnom").value;
        var varprodquantite =         document.getElementById("prodquantite").value;
        var varprodallergenes =       document.getElementById("prodallergenes").value;
        var varprodprix =             document.getElementById("prodprix").value;
        varprodprix = varprodprix.replace( "," , "." );
        var varprodnombre =           document.getElementById("prodnombre").value;

        if ( !varprodnom )
        {   if (erreur == "")
            {   erreur = erreur + "nom";    }
            else
            {   erreur = erreur + ", nom";  }

	          vide = vide + 1;
        }

        if ( !varprodquantite )
        {   if (erreur == "")
            {   erreur = erreur + "quantité";    }
            else
            {   erreur = erreur + ", quantité";  }

	          vide = vide + 1;
        }

        if ( !varprodallergenes )
        {   if (erreur == "")
            {   erreur = erreur + "allergènes";    }
            else
            {   erreur = erreur + ", allergènes";  }

	          vide = vide + 1;
        }

        if ( !varprodprix )
        {   if (erreur == "")
            {   erreur = erreur + "prix";    }
            else
            {   erreur = erreur + ", prix";  }

	          vide = vide + 1;
        }

        if ( !varprodnombre )
        {   if (erreur == "")
            {   erreur = erreur + "nombre";    }
            else
            {   erreur = erreur + ", nombre";  }

	          vide = vide + 1;
        }



        if ( vide > 0 )
        {
          if ( vide > 2 )
          {
            alert ( "Il y a des champs non remplis." );
          }
          else
          {

            if ( vide == 2 )
            {
              alert ( "Champs non remplis : " + erreur );
            }
            else
            {
              alert ( "Champ non rempli : " + erreur );
            }

          }

        }
        else
        {

          if ( parseInt(varprodquantite) != varprodquantite )
          {
            erreur = "Une quantité ne doit contenir que des chiffres";
            alert ( erreur );
          }
          else
          {
            if ( varprodquantite > 999 )
            {
              erreur = "Une quantité ne doit pas être supérieur à 999";
              alert ( erreur );
            }
            else
            {


                  if ( parseInt(varprodnombre) != varprodnombre )
                  {
                    erreur = "Un nombre de lots ne doit contenir que des chiffres";
                    alert ( erreur );

                  }
                  else
                  {
                    if ( varprodnombre > 999 )
                    {
                      erreur = "Un nombre de lots ne doit pas être supérieur à 999";
                      alert ( erreur );
                    }
                    else
                    {

                      if ( parseFloat(varprodprix) != NaN )
                      {
                        erreur = "Un prix ne doit être composé que de chiffres";
                        alert ( erreur );
                      }
                      else
                      {

                        if ( varprodprix > 999 )
                        {
                          erreur = "Un prix ne doit pas être supérieur à 999";
                          alert ( erreur );
                        }
                        else
                        {
                          document.getElementById("formshop").submit();

                        }

                      }


                  }



            }
          }

        }


   }});
