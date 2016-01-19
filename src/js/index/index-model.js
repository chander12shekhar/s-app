angular.module('FoodeeBuddee.factories.IndexModel', [])
  .factory('IndexModelFactory', function(UserService) {

      var indexFactory = function() {
   
       var indexfactory = this;
        indexfactory.indexMenu = [{
            name: localeString.index_Eateries,
            url: '#/eateries',
            imgsrc: 'images/eateries/eateries-4.png'
          }
            /*, {
            name: localeString.index_Receipes,
            url: '#/recipes',
            imgsrc: 'images/receipe/recipes-home-2.png'
          },

          {
            name: localeString.index_Blogs,
            url: '#/blogs',
            imgsrc: 'images/receipe/recipes-home-4.png'
          }*/

        ];


        if (UserService) {
          if (UserService.isLogged()) {
            indexfactory.indexMenu.push({
                name: localeString.index_Social,
                url: '#/social',
                imgsrc: 'images/eateries/eateries-2.png'
              },

              {
                name: localeString.index_Vochers,
                url: '#/voucher',
                imgsrc: 'images/receipe/recipes-home-4.png'

              }

            );

          }
        }



        };

        return indexFactory;

      });