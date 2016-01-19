angular.module('FoodeeBuddee.controllers.Eatery', [])
  .controller('EateryController',
    function ($scope, deviceReady, EateriesResource, $routeParams, UserService, EateryFactory,
              EateryHelperService, CameraService, StorageService, MessageService, $location, $rootScope,
              EateryService, $cordovaSocialSharing, SharedState, NavigatorService, SocialPostService, $cordovaImagePicker,
              $base64, SearchService, SubscriberService, VoucherService,$interval) {
      var self = this;
      self.prevent = false;
      self.googleMainImage = false;
      NavigatorService.setCurrent('/eateries');
      NavigatorService.setPrevious('/');

      SearchService.hide = true;
      SubscriberService.publish('searchBar');

      SharedState.initialize($scope, 'modalSimpleRate');
      SharedState.initialize($scope, 'modalSimpleReview');

      self.busy = false;
      self.page = 1;
      self.simpleReviewText = '';
      self.subCusines = false;
      self.eatery = new EateryFactory();
      $scope.gPlace = null;
      self.details = '';
      self.loggedIn = UserService.isLogged();
      if(!self.loggedIn){
          if($routeParams.id == null){
              $location.path('/login');
              MessageService.flush('Please SIGN IN for further actions !', 'warning', null, null);
          }
      }
      self.images = [];
      self.menuImages = [];
      self.eatery.address = {'doorNumber': '', 'country': '', 'state': '', 'city': '', 'locality': '', 'pincode': ''};
      self.checkInfo = {status: '', eatery: {}};

      self.submitSimpleReview = function () {
        if (self.simpleReviewText != '') {
          self.busy = true;
          EateryHelperService.submitSimpleReview($scope.eatery.id, self.simpleReviewText, 'Review for' + $scope.eatery.name)
            .success(function (result) {
              SharedState.toggle('modalSimpleReview');
              MessageService.flush('Thank you for your review!', 'success');
              self.busy = false;
              $scope.eatery.simpleReview = true;
            })
            .error(function (result) {
              self.busy = false;
            });
        }
        else {
          MessageService.flush('Please write something', 'failure');
        }
      };

      self.submitSimpleRate = function () {

        if (self.simpleRate != 0) {
          self.busy = true;
          EateryHelperService.submitSimpleRate($scope.eatery.id, self.simpleRate)
            .success(function (result) {
              SharedState.toggle('modalSimpleRate');
              MessageService.flush('Thank you for Rating!', 'success');
              self.busy = false;
              $scope.eatery.simpleRating = true;
            })
            .error(function (result) {
              self.busy = false;
            });
        }
        else {
          MessageService.flush('Give minimum 1 star', 'failure');
        }
      };

      self.toggleType = function (ele) {
        $("#"+ele).toggleClass("switchOn");
      };

      self.removeErrorBorder = function (ele){
        $("#"+ele).removeClass('error');
      };

      self.removeError = function (element){
        $("#"+element).removeClass('error');
      };

      self.checkError = function (element){
        if($("#"+element).val() == ''){
          $("#"+element).addClass('error');
        }
      };

      $(".dropdown-toggle").click(function(){
          var id = $(this).parents(".multi-select").attr("id");
          if($("#"+id).hasClass('error')){
            $("#"+id).removeClass('error');
          }
      });

      self.updateEatery = function (data) {
        if (data) {
          var eateryHelper = {};
          eateryHelper.name = data.name;
          eateryHelper.city = placesFilter(data.address_components, 'locality');
          eateryHelper.state = placesFilter(data.address_components, 'administrative_area_level_1');
          eateryHelper.country = placesFilter(data.address_components, 'country');
          eateryHelper.latitude = data.geometry.location.lat();
          eateryHelper.longitude = data.geometry.location.lng();
          EateryHelperService.checkDuplication(eateryHelper)
            .success(function (result) {
              $(".thumbnail").hide();
              if (result.message == 'success') {
                var address = data.formatted_address.split(',');
                self.eatery.name = data.name;
                self.eatery.address.lat = data.geometry.location.lat();
                self.eatery.address.lng = data.geometry.location.lng();
                self.eatery.address.address1 = placesFilter(data.address_components, 'route');
                self.eatery.address.doorNumber = placesFilter(data.address_components, 'street_number');
                self.eatery.address.locality = placesFilter(data.address_components, 'route');
                self.eatery.address.city = placesFilter(data.address_components, 'locality');
                self.eatery.address.state = placesFilter(data.address_components, 'administrative_area_level_1');
                self.eatery.address.country = placesFilter(data.address_components, 'country');
                self.eatery.address.pincode = placesFilter(data.address_components, 'postal_code');
                if(data.photos !== undefined){
                    var mainImage = data.photos[0];
                    self.googleMainImage = true;
                    //var thumbnail = document.getElementById('thumbnail');
                    //thumbnail.style.display = 'block';
                    $(".thumbnail").show();
                    getImageData(mainImage.getUrl({'maxWidth': 1200, 'maxHeight': 800}));
                }
              }
              else {
                MessageService.flush('Eatery already exists !', 'warning');
              }
            })
            .error(function (result) {
              MessageService.flush('Something went wrong. Please try again later!', 'failure');
            });
        }
      };

      var getImageData = function (url) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          var canvas = document.createElement('CANVAS');
          var ctx = canvas.getContext('2d');
          canvas.height = this.height;
          canvas.width = this.width;
          ctx.drawImage(this, 0, 0);
          var dataURL = canvas.toDataURL('image/jpeg', 1.0);
          canvas = null;
          var rawData = dataURL.replace(/^data:image\/(png|jpeg);base64,/, "");
          var smallImage = document.getElementById('main-image');
          smallImage.style.display = 'block';
          smallImage.src = "data:image/jpeg;base64," + rawData;
          self.mainImage = rawData;
        };
        img.src = url;
      };

      self.subCuisineTypes = [];
      self.subCuisineLabels = {buttonDefaultText: 'Select Sub-Cuisines'};

      self.cuisineTypes = [];
      self.cuisineLabels = {buttonDefaultText: 'Select Cuisines'};
      EateryHelperService.getCuisineTypes()
        .success(function (data) {
          self.cuisineTypes = data;
        })
        .error(function (data) {

        });

      self.eateryTypes = [];
      self.eateryTypeLabel = {buttonDefaultText: 'Eatery Type'};
      EateryHelperService.getEateryTypes()
        .success(function (data) {
          self.eateryTypes = data;
        })
        .error(function (data) {

        });

      self.eateryFacilities = [];
      self.facilityLabels = {buttonDefaultText: 'Facilities'};
      EateryHelperService.getEateryFacilities()
        .success(function (data) {
          self.eateryFacilities = data;
        })
        .error(function (data) {

        });

      self.eateryPayments = [];
      self.eateryPaymentsLabels = {buttonDefaultText: 'Payment Options'};
      EateryHelperService.getPaymentOptions()
        .success(function (data) {
          self.eateryPayments = data;
        })
        .error(function (data) {

        });


      self.eateryFeatures = [];
      self.eateryFeaturesLabels = {buttonDefaultText: 'Features'};
      EateryHelperService.getFeatureOptions()
        .success(function (data) {
          self.eateryFeatures = data;
        })
        .error(function (data) {

        });

      self.mealTypes = [];
      self.mealTypesLabels = {buttonDefaultText: 'Meal Type'};
      EateryHelperService.getMealTypes()
        .success(function (data) {
          self.mealTypes = data;
        })
        .error(function (data) {

        });

      /*self.menuType = [];
      self.menuTypeLabels = {buttonDefaultText: 'Menu Type'};
      EateryHelperService.getMenuType()
        .success(function (data) {
          self.menuType = data;
        })
        .error(function (data) {

        });*/


      self.multiSelectSettings = EateryHelperService.multiSelectSettings;
      self.multiSelectCuisineSettings = EateryHelperService.multiSelectCuisineSettings;

      self.manageSubCuisines = {
        onItemSelect: function (item) {
          self.removeErrorBorder('cuisines');
          self.addOrRemoveSubCuisines(item, 'add');
        },
        onItemDeselect: function (item) {
          self.addOrRemoveSubCuisines(item, 'remove');
        }
      };

      self.addOrRemoveSubCuisines = function (item, type) {
        EateryHelperService.getSubCuisineTypes(item.id)
          .success(function (data) {
            if (type == 'add') {
              for (var i = 0; i <= data.length - 1; i++) {
                self.subCusines = true;
                self.subCuisineTypes.push(data[i]);
              }
            }
            else if (type = 'remove') {
              for (var i = 0; i <= self.subCuisineTypes.length - 1; i++) {
                for (var j = 0; j <= data.length - 1; j++) {
                  //removing the subcusines values.
                  if (self.subCuisineTypes[i].id == data[j].id) {
                    if(self.subCuisineTypes.length <= 1){
                      self.subCusines = false;
                    }
                    self.subCuisineTypes.splice(i, 1);
                    //removes the selected values in eatery if any
                    for (var k = 0; k <= self.eatery.subCuisines.length - 1; k++) {
                      if (self.eatery.subCuisines[k].id == data[j].id) {
                        self.eatery.subCuisines.splice(k, 1);
                      }
                    }
                  }
                }
              }
            }
          })
          .error(function (error) {
            MessageService.flush('Something went wrong. Please try again later!', 'failure');
          });
      };

      var placesFilter = function (heystack, key) {
        var obj = heystack.filter(function (obj) {
          return obj.types[0] === key;
        })[0];
        if(obj === undefined) return '';
        return obj.long_name;
      };

      self.isLogged = function () {
        return UserService.isLogged();
      };

      $scope.isThisAnObject = function (input) {
        return angular.isObject(input) ? true : false;
      };

      EateriesResource.get({
        id: $routeParams.id
      }).$promise
        .then(function (eatery) {
          NavigatorService.setCurrent('/eateries/' + $routeParams.id);
          NavigatorService.setPrevious('/eateries/list/all');
          $scope.eatery = eatery;
          EateryHelperService.currentEatery = eatery.id;
          if(eatery.viewFromVoucher == true) {
            NavigatorService.setPrevious('/vouchers/view/' + VoucherService.currentVoucher);
          }
          $scope.footerModel = initFooter();
        });

      self.hasLocation = function (eatery) {
        return !!eatery && !!eatery.address && !!eatery.address.lat && !!eatery.address.lng;
      };


      self.position1 = function (eatery) {

        if (!eatery) return '';

        return self.hasLocation(eatery) ?
        eatery.address.lat + ', ' + eatery.address.lng :
        eatery.address.locality + ', ' + eatery.address.city;
      };

      var hasAccess = function () {
        return self.loggedIn;
      };

      var isLiked = function () {
        if ($scope.eatery.like === undefined) {
          return false;
        }
        return $scope.eatery.like;
      };

      var isFavourited = function () {
        if ($scope.eatery.fav === undefined) {
          return false;
        }
        return $scope.eatery.fav;
      };

      var initFooter = function () {
        return [{
          name: localeString.footer_Rate,
          url: '/eateries/advanceRating/' + $routeParams.id,
          iconClass: 'foodeebudee-rate-icon',
          iconTextClass: 'foodeebudee-rate-icon-text',
          //disabled: !hasAccess(),
          disabled: false,
          checked: !hasAccess(),
          action: function () {
            if (hasAccess()) {
              NavigatorService.setOverwrite('/eateries/' + $routeParams.id);
              NavigatorService.setCurrent('/eateries/rating/' + $routeParams.id);
              $location.path('/eateries/rating/' + $scope.eatery.id);
            }
            else {
              MessageService.flush('Please SIGN IN to Rate!', 'failure');
            }
          },
          oneWay: false
        },
          {
            name: 'Review',
            url: "/eateries/reviewLaunch/" + $routeParams.id,
            iconClass: 'fa-pencil',
            //disabled: !hasAccess(),
            disabled: false,
            checked: !hasAccess(),
            action: function () {
              if (hasAccess()) {
                NavigatorService.setOverwrite('/eateries/' + $routeParams.id);
                NavigatorService.setCurrent('/eateries/review/' + $routeParams.id);
                $location.path('/eateries/review/' + $scope.eatery.id);
              }
              else {
                MessageService.flush('Please SIGN IN to Review!', 'failure');
              }
            },
            oneWay: false
          },
          {
            name: localeString.footer_Yummy,
            iconClass: 'foodeebudee-unyummy-icon',
            iconTextClass: 'foodeebudee-yummy-icon-text',
            disabled: !hasAccess(),
            checked: isLiked(),
            action: function () {
              if (hasAccess()) {
                EateryService.like($scope.eatery);
              }
              else {
                MessageService.flush('Please SIGN IN to mark this Eatery as Yummy!', 'failure');
              }
            },
            iconClassChecked: 'foodeebudee-yummy-icon',
            oneWay: false
          }, {
            name: localeString.footer_Favourite,
            url: '#',
            iconClass: 'foodeebudee-unfav-icon',
            iconTextClass: 'foodeebudee-fav-icon-text',
            disabled: !hasAccess(),
            checked: isFavourited(),
            action: function () {
              if (hasAccess()) {
                EateryService.favourite($scope.eatery);
              }
              else {
                MessageService.flush('Please SIGN IN to mark this Eatery as your Favourite!', 'warning', null, null);
              }
            },
            iconClassChecked: 'foodeebudee-fav-icon',
            oneWay: true
          }, {
            name: localeString.footer_Share,
            iconClass: 'fa-share-alt',
            checked: false,
            disabled: false,
            action: function () {
              $cordovaSocialSharing
                .share("Check this Eatery on Foodeebuddee - " + $scope.eatery.name +"\n", null, null, $scope.eatery.short_url)
                .then(function (result) {
                  //
                }, function (err) {
                  MessageService.flush('Something went wrong with the sharing. Please try again later!', 'warning');
                });
            },
            oneWay: false
          }];
      };

      $scope.reviewLaunch = function (footerModel) {
        if (self.loggedIn) {
          switch (footerModel.name) {
            case 'Review':
              if (!self.eatery.alreadyReviewed) {
                $location.url(footerModel.url);
              } else {
                $location.url(footerModel.url + $routeParams.id);
              }
              break;
            case localeString.footer_Rate:
              $location.url(footerModel.url);
              break;
            case localeString.footer_Yummy:
              self.doPostYummyRecipe();
              break;
            case localeString.footer_Fav:
              self.doPostFavRecipe();
              break;
            case localeString.footer_Share:
              self.showSocialModal();
              break;
            default:
          }
        }
        else {
          switch (footerModel.name) {
            case localeString.footer_Share:
              self.showSocialModal();
              break;
            case 'Review':
            case localeString.footer_Rate:
            case localeString.footer_Yummy:
            case localeString.footer_Fav:
            default:
              self.showModalUserDoestnotAuthorized();
              break;
          }

        }
      };
      //Todo rectify this function
      self.selectPicture = function (eateryMain, eaterySub) {
        deviceReady(function () {
            $cordovaImagePicker.getPictures({
                maximumImagesCount: 1,
                quality: 60,
                width: 800,
                height: 800
              })
              .then(function (result) {
                window.resolveLocalFileSystemURL(result[0], function (fileEntry) {
                  var reader = new FileReader();
                  var loadImage = function (file) {
                    reader.onload = function (readerEvt) {
                      var binaryString = readerEvt.target.result;
                      var imageData = $base64.encode(binaryString);
                      var thumbnail = document.getElementById(eateryMain);
                      thumbnail.style.display = 'block';
                      var smallImage = document.getElementById(eaterySub);
                      smallImage.style.display = 'block';
                      smallImage.src = "data:image/jpeg;base64," + imageData;
                      if(eateryMain === 'image-thumbnail'){
                        self.googleMainImage = false;
                        self.mainImage = imageData;
                      }
                      else if(eateryMain === 'eateryPhoto'){
                        self.images.push(imageData);
                      }
                      else if(eateryMain === 'eateryMenu'){
                        self.menuImages.push(imageData);
                      }
                    };
                    reader.readAsBinaryString(file);
                  };

                  fileEntry.file(loadImage, function (err) {
                    console.log(err);
                  });

                }, function (err) {
                  console.log(err);
                });


              }, function (error) {
                alert("Sorry, we could not load your picture");
              });
          }
        );
      };

      self.takePicture = function (eateryMain, eaterySub) {
        CameraService.setElement('main-image');
        CameraService.capture(function (imageData) {
          var thumbnail = document.getElementById(eateryMain);
          thumbnail.style.display = 'block';
          var smallImage = document.getElementById(eaterySub);
          smallImage.style.display = 'block';
          smallImage.src = "data:image/jpeg;base64," + imageData;
          if(eateryMain === 'image-thumbnail'){
            self.googleMainImage = false;
            self.mainImage = imageData;
          }
          else if(eateryMain === 'eateryPhoto'){
            self.images.push(imageData);
          }
          else if(eateryMain === 'eateryMenu'){
            self.menuImages.push(imageData);
          }
        });
      };

      self.persist = function () {
        if (EateryHelperService.validateEatery(self.eatery)){
            self.page += 1;
            var topElement = angular.element(document.getElementById('create-eatery-step'));
            var scrollableContentController = topElement.controller('scrollableContent');
            scrollableContentController.scrollTo(topElement, -30);
        }
      };

      self.cancel = function () {

      };

      self.previous = function () {
        self.page = self.page - 1;
        var topElement = angular.element(document.getElementById('create-eatery-step'));
        var scrollableContentController = topElement.controller('scrollableContent');
        scrollableContentController.scrollTo(topElement, -30);
      };

      self.addDish = function () {
        self.eatery.famousDishes.push({dish: ''});
      };

      self.removeDish = function (item) {
        self.eatery.famousDishes.splice(self.eatery.famousDishes.indexOf(item), 1);

      };

      self.addOpening = function () {
        self.eatery.timingList.push({openingHours: '',happyHours:''});
      };

      self.removeOpening = function (item) {
        self.eatery.timingList.splice(self.eatery.timingList.indexOf(item), 1);
      };

      self.fetchEateryCoordinates = function(){
          var geocoder = new google.maps.Geocoder();
          var address = self.eatery.address.address1+','+self.eatery.address.country+','+self.eatery.address.state+','+self.eatery.address.city;
          geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              self.prevent = true;
              self.eatery.address.lat = results[0].geometry.location.lat();
              self.eatery.address.lng = results[0].geometry.location.lng();
          }
          });
      };
      self.publish = function () {
        if (EateryHelperService.validateEatery(self.eatery)) {
            self.busy = true;
            if(self.eatery.address.lat == 0 || self.eatery.address.lat === undefined){
                self.fetchEateryCoordinates();
            }
            else{
                self.prevent = true;
            }
            var stop = $interval(function() {
                if(self.prevent){
                    $interval.cancel(stop);
                    EateryHelperService.createEatery(self.eatery, self.mainImage, self.googleMainImage, self.images, self.menuImages)
                    .success(function (result) {
                        if(result.id != null && result.id !== undefined){
                          NavigatorService.setPrevent(false);
                          EateryService.generateShortUrl(result.id,result.aliasName);
                          MessageService.flush('Thanks for creating an Eatery!', 'success');
                          $location.path('/eateries/list/my');
                        }
                        else{
                            self.busy = false;
                            MessageService.flush("Something went wrong. Please try again later!", 'danger');
                        }
                    })
                    .error(function (error) {
                      self.busy = false;
                      MessageService.flush("Something went wrong. Please try again later!", 'danger');
                    });
                }
           },500);
        }
      };

      self.multiCapture = function () {
        CameraService.multiCapture(handleMultiCapture);
      };

      var handleMultiCapture = function (imageData) {
        self.images.push(imageData);
      };

      self.multiCaptureMenu = function () {
        CameraService.multiCapture(handleMultiCaptureMenu);
      };

      var handleMultiCaptureMenu = function (imageData) {
        self.menuImages.push(imageData);
      };

      self.showSocialModal = function () {
        $rootScope.Ui.toggle('modalSocial');
      };

      self.showCommentModal = function () {
        $rootScope.Ui.toggle('modalComment');
      };
      self.showSuccessModal = function () {
        $rootScope.Ui.toggle('modalSuccess');
      };
      self.showFailureModal = function () {
        $rootScope.Ui.toggle('modalFailure');
      };

      self.showFutureInProgressModal = function () {
        $rootScope.Ui.toggle('modalFutureInProgress');
      };
      self.showModalUserDoestnotAuthorized = function () {
        $rootScope.Ui.toggle('modalusernotauthorized');
      };

      self.checkin = function (eatery) {
        if(self.loggedIn) {
          self.checkInfo.eatery = eatery;
          SocialPostService.checkin(self.checkInfo)
            .success(function (result) {
              MessageService.flush('You checked in successfully!', 'success');
            })
            .error(function (result) {
              MessageService.flush('Something went wrong. Please try again later!', 'failure');
            });
        }
        else {
          MessageService.flush('Please SIGN IN to Check-in!', 'warning');
        }
      };

      self.moveTop = function (eatery) {
        $(".select-box").animate({scrollTop: 0}, "fast");
      };

      self.comingSoon = function() {
        MessageService.flush('Detailed Views Coming Soon!', 'warning');
      };

      SharedState.initialize($scope, 'modalOverAllRating');
      self.showOverAllRatings = function(length) {
        if(length != 0){
            if(self.loggedIn)  SharedState.toggle('modalOverAllRating');
            else MessageService.flush('Please SIGN IN to view Overall ratings!', 'warning');
        }
        else{
            MessageService.flush('No Ratings yet !', 'warning');
        }
      };

      if($("#new-eatery").val() == 'true'){
          NavigatorService.setPrevent(true);

          //restricting the back button not required as of now : do not delete
          /*document.addEventListener("backbutton", onBackKeyDown, false);
          function onBackKeyDown(e) {
            e.preventDefault();
          }*/
      }

    }
  );