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
	else if (typeof obj.openTime == "undefined" || typeof obj.closeTime == "undefined")
		errors.openAndClose = "restaurant opening hour can not be null";
	if (!obj.rating) errors.rating = "rating star can not be null";
	if (!obj.comment) errors.comment = "comment about restaurant can not be null";
	return errors;
};

Meteor.methods({

	inesrtRestaurnat: function(inputRestaurantInfo, restaurantImages){
		var errors = validateCheck(inputRestaurantInfo, restaurantImages);
		if (_.keys(errors).length > 0){
			throw new Meteor.Error('invalid-input', JSON.stringify(errors));
		}
		check(inputRestaurantInfo, {
			name: String,
			menus: Array,
			maxMember: Number,
			address: String,
			openTime: Number,
			closeTime: Number,
			rating: Number,
			comment: String,
			latlng: {
				lat: Number,
				lng: Number
			}
		});

		var restaurantInfo = _.extend(inputRestaurantInfo,{
			createdAt: new Date(),
			createdBy: Meteor.user()._id,
			images: []
		});

		var restaurantId = Restaurants.insert(restaurantInfo);

		for(var i=0; i<restaurantImages.length; i++){
			RestaurantImages.insert(restaurantImages[i], function(err, file){
				if(err){
					console.log(err)
				}else{
					if (RestaurantImages.findOne({_id: file._id}).isUploaded()){
						Restaurants.update({_id: restaurantId}, {$push: {images: file._id}});
					}
					var restaurant = Restaurants.findOne({_id: restaurantId});
					RestaurantImages.remove({_id: {$in:restaurant.images}});
					Restaurants.remove({_id: restaurant._id});
					throw new Meteor.Error('invalid-input', "File upload failed");
				}
			});
		}

		return restaurantId;
	}
});