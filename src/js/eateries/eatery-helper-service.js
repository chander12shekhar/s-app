angular.module('FoodeeBuddee.eatery.helper', [])
  .service('EateryHelperService', function ($http, SettingsService, EateryFactory, MessageService, LeaderBoardService) {

    var self = this;
    var validCheck = true;

    self.currentEatery = '';

    self.getCuisineTypes = function () {
      return $http.get(SettingsService.rest_url + '/api/v1/cuisines');
    };

    self.getSubCuisineTypes = function (id) {
      return $http.get(SettingsService.rest_url + '/api/v1/subcuisines/'+id);
    };

    self.getEateryTypes = function () {
      return $http.get(SettingsService.rest_url + '/api/v1/eaterytypes');
    };

    self.getEateryFacilities = function () {
      return $http.get(SettingsService.rest_url + '/api/v1/facilities');
    };

    self.getPaymentOptions = function () {
      return $http.get(SettingsService.rest_url + '/api/v1/payment-options');
    };

    self.getFeatureOptions = function () {
      return $http.get(SettingsService.rest_url + '/api/v1/features');
    };

    self.getMealTypes = function () {
      return $http.get(SettingsService.rest_url + '/api/v1/meal-types');
    };

    self.getMenuType = function () {
      return $http.get(SettingsService.rest_url + '/api/v1/menu-type');
    };

    self.getMealOptions = function () {
      return $http.get(SettingsService.rest_url + '/api/v1/meal-options');
    };
    self.createEatery = function (eatery, mainImage,isGoogleMainImage, eateryImages, menuImages) {
      var eateryAdapter = {};
      eateryAdapter.eatery = eatery;
      eateryAdapter.image = mainImage;
      eateryAdapter.eateryImages = eateryImages;
      eateryAdapter.menuImages = menuImages;
      eateryAdapter.googleMainImage = isGoogleMainImage;
      var req = {
        method: "POST",
        url: SettingsService.rest_url + '/api/v1/eateries/create',
        data: eateryAdapter
      };
      LeaderBoardService.clearCache();
      return $http(req);
    };

    // TODO refactor this dirty validation thingy
    self.validateEatery = function (tempEatery) {
      validCheck = true;
      valid = true;
      websiteValid = true;
      tempEatery.name = tempEatery.name.trim();
      tempEatery.price = tempEatery.price;
      tempEatery.address.country = tempEatery.address.country.trim();
      tempEatery.address.state = tempEatery.address.state.trim();
      tempEatery.address.city = tempEatery.address.city.trim();
      tempEatery.address.locality = tempEatery.address.locality.trim();
      tempEatery.address.pincode = tempEatery.address.pincode.trim();
      if(tempEatery.eateryDigitalContacts.eateryWebsite != ''){
        self.websiteFormat('EWebsite');
        if(!websiteValid){
            tempEatery.eateryDigitalContacts.eateryWebsite = 'http://' +tempEatery.eateryDigitalContacts.eateryWebsite;
         }
      }
      if(tempEatery.eateryDigitalContacts.eateryFacebook != ''){
        self.faceBookFormat('EFacebook');
        if(!websiteValid){
            tempEatery.eateryDigitalContacts.eateryFacebook = 'https://' +tempEatery.eateryDigitalContacts.eateryFacebook;
        }
      }
      if(tempEatery.eateryDigitalContacts.eateryTwitter != ''){
        self.twitterFormat('ETwitter');
        if(!websiteValid){
            tempEatery.eateryDigitalContacts.eateryTwitter = 'https://' +tempEatery.eateryDigitalContacts.eateryTwitter;
        }
      }
      if(tempEatery.eateryDigitalContacts.eateryPinterest != ''){
        self.pinterestFormat('EPinterest');
        if(!websiteValid){
            tempEatery.eateryDigitalContacts.eateryPinterest = 'https://' +tempEatery.eateryDigitalContacts.eateryPinterest;
        }
      }
      /*if(tempEatery.menuType.id === undefined) tempEatery.menuType = tempEatery.menuType.id;
      else tempEatery.menuType = '';*/
      if(tempEatery.name == '') { self.checkValidate('Ename');}
      if(tempEatery.address.country == '') { self.checkValidate('Ecountry');}
      if(tempEatery.address.state == '') { self.checkValidate('Estate');}
      if(tempEatery.address.city == '') { self.checkValidate('Ecity');}
      if(tempEatery.address.locality == '') { self.checkValidate('Elocality');}
      if(tempEatery.address.pincode == '') { self.checkValidate('Epincode');}
      if(tempEatery.cuisines.length == 0) { self.checkValidate('Ecuisines');}
//      if(tempEatery.subCuisines.length == 0) { MessageService.flush('Please select Eatery Sub-Cuisine type!', 'warning'); return false; }
      if(tempEatery.eateryType.length == 0) { self.checkValidate('EeateryType');}
      if(tempEatery.facilities.length == 0) { self.checkValidate('Efacilities');}
      if(tempEatery.paymentOptions.length == 0) { self.checkValidate('Epayment');}
      if(tempEatery.price == '') { self.checkValidate('Eprice');}
      if(tempEatery.menuType == '' ) { self.checkValidate('EmenuType');}
      if(tempEatery.address.pincode != ''){ self.checkZipCodeFormat('Epincode');}
      if(tempEatery.address.mobile != '' && typeof tempEatery.address.mobile != 'undefined'){self.checkNumberFormat('EMobile');}
      if(tempEatery.address.landline != '' && typeof tempEatery.address.landline != 'undefined'){ self.checkNumberFormat('ELandline');}
      if(tempEatery.address.fax != '' && typeof tempEatery.address.fax != 'undefined'){ self.checkNumberFormat('EFax');}
      if(tempEatery.address.email != '' && typeof tempEatery.address.email != 'undefined'){self.checkEmailFormat('EMail');}
      if(tempEatery.price != ''){self.priceValidation('Eprice');}
      if(tempEatery.speciality != '' && typeof tempEatery.speciality != 'undefined'){self.checkCommaFormat('ESpeciality');}
      if(tempEatery.eateryOptions.eateryAttire != '' && typeof tempEatery.eateryOptions.eateryAttire != 'undefined'){self.checkCommaFormat('EAttire');}
      if(tempEatery.eateryOptions.eateryAmbience != '' && typeof tempEatery.eateryOptions.eateryAmbience != 'undefined'){self.checkCommaFormat('EAmbience');}
      if(tempEatery.eateryOptions.eateryNoiseLevel != '' && typeof tempEatery.eateryOptions.eateryNoiseLevel != 'undefined'){self.checkCommaFormat('ENoiseLevel');}
      if(tempEatery.eateryDigitalContacts.eateryWebsite != '' &&  tempEatery.eateryDigitalContacts.eateryWebsite != 'undefined'){self.checkWebsiteFormat('EWebsite');}
      if(tempEatery.eateryDigitalContacts.eateryFacebook != '' &&  tempEatery.eateryDigitalContacts.eateryFacebook != 'undefined'){self.checkFacebookFormat('EFacebook');}
      if(tempEatery.eateryDigitalContacts.eateryTwitter != '' &&  tempEatery.eateryDigitalContacts.eateryTwitter != 'undefined'){self.checkTwitterFormat('ETwitter');}
      if(tempEatery.eateryDigitalContacts.eateryPinterest != '' &&  tempEatery.eateryDigitalContacts.eateryPinterest != 'undefined'){self.checkPinterestFormat('EPinterest');}
      if(validCheck == false){
        if(valid == true){
            MessageService.flush('Please fill all the mandatory fields', 'warning');
        }
        return false;
      }
      var eateryHelper = {};
      eateryHelper.name =  tempEatery.name;
      eateryHelper.city = tempEatery.address.city.trim();
      eateryHelper.state = tempEatery.address.state.trim();
      eateryHelper.country = tempEatery.address.country.trim();
      self.checkDuplication(eateryHelper)
        .success(function(result){
          if(result.message == 'success'){return true;}
          else{
            MessageService.flush('Eatery already exists!', 'warning');
            return false;
          }
        })
        .error(function(result) {
          MessageService.flush('We could not process your request. Please try again later!', 'failure');
          return false;
        });
      return true;
    }

    self.checkValidate = function(ele){
        $("."+ele).addClass('error');
        validCheck = false;
        return validCheck;
    };

    self.checkDuplication = function(eateryHelper) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/eateries/checkDuplication/',
        data :  eateryHelper
      };
      return $http(req);
    };

    self.submitSimpleReview = function(id, comment, title) {
      var data = {
        reviewContent: comment,
        reviewTitle: title
      };
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/eateries/simpleReview/' + id,
        data: data
      };
      return $http(req);
    };

    self.submitSimpleRate = function(id, rate) {
      var data = {
        ratingCount: rate
      };
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/eateries/simpleRating/' + id,
        data: data
      };
      return $http(req);
    };
    self.submitAdvancedRate = function(id, eateryRatingFactory) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/eateries/advRating/' + id,
        data: eateryRatingFactory,
      };
      return $http(req);
    };
    self.submitAdvancedReview = function(id,content,title) {
      var data = {
        reviewContent: content,
        reviewTitle: title
      };
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/eateries/advReview/' + id,
        data: data,
      };
      return $http(req);
    };

    self.multiSelectSettings = {
      smartButtonMaxItems: 3,
      smartButtonTextConverter: function (itemText, originalItem) {
        return originalItem.name;
      },
      displayProp: 'name',
      buttonClasses: 'btn btn-default full-width multiselect',
      scrollableHeight: '300px',
      scrollable: true,
      enableSearch: true
    };

    self.multiSelectCuisineSettings = {
      smartButtonMaxItems: 3,
      smartButtonTextConverter: function (itemText, originalItem) {
        return originalItem.name;
      },
      displayProp: 'name',
      buttonClasses: 'btn btn-default full-width multiselect',
      scrollableHeight: '300px',
      scrollable: true,
      enableSearch: true,
      showCheckAll : false
    };

    self.likeReview = function(id) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/review/like/' + id
      };
      return $http(req);
    };

    self.likeAdvReview = function(id) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/blog/like/' + id
      };
      return $http(req);
    };


    self.updateReview = function(id,title,content) {
      var data = {
        reviewContent: content,
        reviewTitle: title
      };
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/review/update/' + id,
        data : data
      };
      return $http(req);
    };

    self.deleteReview = function(id,type,typeId) {
      var url = id+'/'+type+'/'+typeId;
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/review/delete/' + url
      };
      return $http(req);
    };

    self.updateAdvReview = function(id,title,content) {
      var data = {
        reviewContent: content,
        reviewTitle: title
      };
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/blog/update/' + id,
        data : data
      };
      return $http(req);
    };

    self.submitReviewComment = function(id,comment) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/review/comment/' + id,
        data : {
          commentContent: comment
        }
      };
      return $http(req);
    };

    self.submitAdvReviewComment = function(id,comment) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/blog/comment/' + id,
        data : {
          commentContent: comment
        }
      };
      return $http(req);
    };

    self.updateReviewComment = function(id,comment) {
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/review/comment/edit/' + id,
        data : {
          commentContent: comment
        }
      };
      return $http(req);
    };

    self.deleteReviewComment = function(id,reviewId) {
      var url = id+'/'+reviewId;
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/review/comment/delete/' + url
      };
      return $http(req);
    };

    self.deleteAdvReviewComment = function(id,reviewId) {
      var url = id+'/'+reviewId;
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/blog/comment/delete/' + url
      };
      return $http(req);
    };

    self.makeReviewHelpFull = function(id,option) {
      var url = id+'/'+option;
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/review/suggest/' + url
      };
      return $http(req);
    };

    self.makeAdvReviewHelpFull = function(id,option) {
      var url = id+'/'+option;
      var req = {
        method: 'POST',
        url: SettingsService.rest_url + '/api/v1/blog/suggest/' + url
      };
      return $http(req);
    };

    self.validateSimpleReview = function(simpleReviewText,simpleReviewTitle) {
      var valid = true;
      if(simpleReviewText != '' && simpleReviewTitle != '' ){
        if(simpleReviewTitle.length < 5){
          valid = false;
          MessageService.flush('Review title has to contain a minimum of 5 characters!', 'warning');
        }
        else if(simpleReviewText.length < 10){
          valid = false;
          MessageService.flush('Review content has to contain a minimum of 10 characters!', 'warning');
        }
      }
      else{
        valid = false;
        MessageService.flush('Your review cannot be empty!', 'warning');
      }
      return valid;
    };

    self.validateAdvReview = function(advReviewTitle,advReviewText) {
      var valid = true;
      if(advReviewTitle != '' && advReviewText != ''){
        if(advReviewTitle.length < 5){
          valid = false;
          MessageService.flush('Review title has to contain a minimum of 5 characters!', 'warning');
        }
        else if(advReviewText.length < 300 ){
          valid = false;
          MessageService.flush('Review content has to contain a minimum of 300 characters!', 'warning');
        }
      }
      else{
        valid = false;
        MessageService.flush('Your review cannot be empty!', 'warning');
      }
      return valid;
    };


      self.checkZipCodeFormat = function(ele){
        var pattern = new RegExp(/^[A-Za-z0-9\d\s-]+$/);
        var zipCodeValue = $("."+ele).val();
        if(pattern.test($.trim(zipCodeValue)) == false){
            $("."+ele).addClass('error');
            MessageService.flush("ZipCode  Not Allow Special Characters", 'danger');
            validCheck = false;
            valid = false;
        }
        if( $("."+ele).val().length < 4 || $("."+ele).val().length > 9){
            $("."+ele).addClass('error');
            MessageService.flush("Zipcode should between 4 to 9 characters", 'danger');
            validCheck = false;
            valid = false;
        }
      };

      self.checkNumberFormat = function(ele){
        var pattern = new RegExp(/^[0-9-+ ]+$/);
        var eateryNumber = $("."+ele).val();
        if(pattern.test($.trim(eateryNumber)) == false){
            $("."+ele).addClass('error');
            MessageService.flush("Invalid number", 'danger');
            validCheck = false;
            valid = false;
        }
        if( $("."+ele).val().length < 6 || $("."+ele).val().length > 15){
            $("."+ele).addClass('error');
            MessageService.flush("Number should be 6 to 15 characters", 'danger');
            validCheck = false;
            valid = false;
        }
      };

      self.checkEmailFormat = function(ele){
          var pattern = new RegExp(/^([A-Za-z0-9._]+@([\w-]+\.)+[\w-]{2,4})?$/);
          var emailValue = $("."+ele).val();
          if(pattern.test($.trim(emailValue)) == false){
              $("."+ele).addClass('error');
              MessageService.flush("Invalid Email", 'danger');
              validCheck =  false;
              valid = false;
          }
      };

      self.priceValidation = function(ele){
            var priceArray = $("."+ele).val();
            if(priceArray < 0)
            {
                $("."+ele).addClass('error');
                MessageService.flush("Price Not Valid", 'danger');
                validCheck =  false;
                valid = false;
            }
            var pattern = new RegExp(/^[0-9.,]+$/);
            if(pattern.test($.trim(priceArray)) == false){
                $("."+ele).addClass('error');
                MessageService.flush("Price Field Not Allow Special Characters", 'danger');
                validCheck =  false;
                valid = false;
            }

      };

      self.checkSpaceNumericFormat = function(ele){
        var pattern = new RegExp(/^[A-Za-z0-9\d\s]+$/);
        var famoushDish = $("."+ele).val();
        if(pattern.test($.trim(famoushDish)) == false){
            $("."+ele).addClass('error');
            MessageService.flush("Famoush Dish Field Not Allow Special Characters", 'danger');
            validCheck =  false;
            valid = false;
        }
      };

      self.checkCommaFormat = function(ele){
        var pattern = new RegExp(/^[A-Za-z0-9\d\s.,&-:]+$/);
        var speciality = $("."+ele).val();
        if(pattern.test($.trim(speciality)) == false){
            $("."+ele).addClass('error');
            MessageService.flush("Special Characters Not Allow ", 'danger');
            validCheck =  false;
            valid = false;
        }
        if( $("."+ele).val().length < 4 || $("."+ele).val().length > 100){
                $("."+ele).addClass('error');
                MessageService.flush("Characters should be 4 to 100 ", 'danger');
                validCheck =  false;
                valid = false;
        }
      };

      self.checkWebsiteFormat = function(ele){
        var pattern = new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
        if(pattern.test($.trim($("."+ele).val())) == false){
            $("."+ele).addClass('error');
            MessageService.flush("Invalid Website ", 'danger');
            validCheck =  false;
            valid = false;
        }
      };

        self.websiteFormat = function(ele){
          var pattern = new RegExp(/^(www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
          if(pattern.test($.trim($("."+ele).val())) == true){
              websiteValid = false;
          }
        };

        self.faceBookFormat = function(ele){
            var pattern = new RegExp(/^((w{3}\.)?)facebook.com\/.*/i);
            if(pattern.test($.trim($("."+ele).val())) == true){
                websiteValid = false;
            }
        }

      self.checkFacebookFormat = function(ele){
        var pattern = new RegExp(/^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i);
        if(pattern.test($.trim($("."+ele).val())) == false){
            $("."+ele).addClass('error');
            MessageService.flush("Invalid Facebook ", 'danger');
            validCheck =  false;
            valid = false;
        }
      };

      self.twitterFormat = function(ele){
        var pattern = new RegExp(/^((w{3}\.)?)twitter\.com\/.*/i);
         if(pattern.test($.trim($("."+ele).val())) == true){
             websiteValid = false;
         }
      }

      self.checkTwitterFormat = function(ele){
        var pattern = new RegExp(/^(https?:\/\/)?((w{3}\.)?)twitter\.com\/.*/i);
        if(pattern.test($.trim($("."+ele).val())) == false){
          $("."+ele).addClass('error');
          MessageService.flush("Invalid Twitter Format ", 'danger');
          validCheck =  false;
          valid = false;
        }
      };

      self.pinterestFormat = function(ele){
        var pattern = new RegExp(/^(([a-z]*\.)?)pinterest.com\/.*/i);
        if(pattern.test($.trim($("."+ele).val())) == true){
            websiteValid = false;
        }
      };

      self.checkPinterestFormat = function(ele){
        var pattern = new RegExp(/^(https?:\/\/)?(([a-z]*\.)?)pinterest.com\/.*/i);
        if(pattern.test($.trim($("."+ele).val())) == false){
            if(pattern.test($.trim($("."+ele).val())) == false){
              $("."+ele).addClass('error');
              MessageService.flush("Invalid Pinterest Format ", 'danger');
              validCheck =  false;
              valid = false;
            }
        }
      };

    return self;

  });