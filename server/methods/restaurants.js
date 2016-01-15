/**
 * Created by polyhy on 2016. 1. 14..
 */



validateCheck= function(obj, images){
	var errors = {};
	if (!obj.name) errors.name = "restaurant name can not be null";
	if (!obj.menus) errors.menus = "restaurant menus can not be null";
	if (!obj.maxMember) errors.maxMember = "max-member can not be null";
	if (!obj.address) errors.address = "restaurant address can not be null";
	if (!obj.latlng.lat || !obj.latlng.lat) errors.address = "invalid address";
	if (obj.openTime == obj.closeTime) errors.openAndClose = "invalid value";
	else if (!obj.openTime || !obj.closeTime) errors.openAndClose = "restaurant opening hour can not be null";
	if (!obj.rating) errors.rating = "rating star can not be null";
	if (!obj.comment) errors.comment = "comment about restaurant can not be null";
	if (!images || !images.length) errors.images = "count of restaurant images must be over than 0";
	return errors;
};

Meteor.methods({

	inesrtRestaurnat: function(inputRestaurantInfo, restaurantImages){

		var errors = validateCheck(inputRestaurantInfo, restaurantImages);
		if (_.keys(errors).length > 0){
			console.log(errors);
			throw new Meteor.Error('invalid-input', JSON.stringify(errors));
		}

		var restaurantInfo = _.extend(inputRestaurantInfo,{
			createdAt: new Date(),
			createdBy: Meteor.user()._id,
			images: []
		});

		var restaurantId = Restaurants.insert(restaurantInfo);

		for(var i=0; i<restaurantImages.length; i++){
			RestaurantImages.insert(restaurantImages[i], function(err, file){
				//inputRestaurantInfo.images.push = file._id;
				if(err){

				}else{
					//console.log(file);
					Restaurants.update({_id: restaurantId}, {$push: {images: file._id}});
					console.log(file._id);
					console.log(Restaurants.findOne({_id: restaurantId}));
				}
			});
		}

		return restaurantId;
	}
});