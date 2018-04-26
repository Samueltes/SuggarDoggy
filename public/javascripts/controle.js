// $("#btn_rz").click( function()
//    {
//         //event.preventDefault();
// 	      document.getElementById(btn-shopvalide).val("");
// 	      $("#input2")     .val("");
//         $("#textarea1")  .val("");
//    });


   document.getElementById("btn-shopvalide").addEventListener('click', function(e)
   {
        e.preventDefault();

	      erreur = "";
	      vide  = 0;


        if ( document.getElementById("shopspecialite").value.length == 0 )
        {   if (erreur == "")
            {   erreur = erreur + "spécialité";    }
            else
            {   erreur = erreur + ", spécialité";  }

	          vide = vide + 1;
        }

        if ( document.getElementById("shopraisonSociale").value.length == 0 )
        {   if (erreur == "")
            {   erreur = erreur + "raison sociale";    }
            else
            {   erreur = erreur + ", raison sociale";  }

	          vide = vide + 1;
        }


        if ( document.getElementById("shopsiret").value.length == 0 )
        {   if (erreur == "")
            {   erreur = erreur + "siret";    }
            else
            {   erreur = erreur + ", siret";  }

	          vide = vide + 1;
        }


        // if ( document.getElementById("shopraisonSociale").value.length == 0 )
        // {   erreur = erreur + "raison sociale";
	      //     vide = vide + 1;
        // }

        if ( document.getElementById("shopadresse").value.length == 0 )
        {   if (erreur == "")
            {   erreur = erreur + "adresse";    }
            else
            {   erreur = erreur + ", adresse";  }

	          vide = vide + 1;
        }

        if ( document.getElementById("shopcp").value.length == 0 )
        {   if (erreur == "")
            {   erreur = erreur + "code postal";    }
            else
            {   erreur = erreur + ", code postal";  }

	          vide = vide + 1;
        }

        if ( document.getElementById("shopville").value.length == 0 )
        {   if (erreur == "")
            {   erreur = erreur + "ville";    }
            else
            {   erreur = erreur + ", ville";  }

	          vide = vide + 1;
        }

        if ( document.getElementById("shoptel").value.length == 0 )
        {   if (erreur == "")
            {   erreur = erreur + "téléphone";    }
            else
            {   erreur = erreur + ", téléphone";  }

	          vide = vide + 1;
        }

        if ( document.getElementById("shopimage").value.length == 0 )
        {   if (erreur == "")
            {   erreur = erreur + "image";    }
            else
            {   erreur = erreur + ", image";  }

	          vide = vide + 1;
        }

        if ( document.getElementById("shopdescriptif").value.length == 0 )
        {   if (erreur == "")
            {   erreur = erreur + "descriptif";    }
            else
            {   erreur = erreur + ", descriptif";  }

	          vide = vide + 1;
        }



        // if ( $("#input2").value.length == 0 )
        // {   if ( erreur == "" )
        //     {   erreur = erreur + "e-mail";    }
        //     else
        //     {   erreur = erreur + ", e-mail";  }
        //
        //     vide = vide + 1;
        // }

        //
        // if ( $("#textarea1").value.length == 0 )
        // {   if ( erreur == "" )
        //     {   erreur = erreur + "message";    }
        //     else
        //     {   erreur = erreur + ", message";  }
        //
        //     vide = vide + 1;
        // }
        //

        if ( vide > 0 )
        {
            if ( vide > 1 )
            {
                 alert ( "Champs non remplis : " + erreur );
            }
            else
            {
                 alert ( "Champ non rempli : " + erreur );
            }

        }
        else
        {

            // lemail = $("#input2").val();
            // if( !lemail.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i) )
            // {
            //     alert ("Adresse e-mail non valide !");
            // }
            // else
            // {
            //     $("#lemessage").submit();
            // }

        }


   });
