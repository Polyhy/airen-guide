/**
 * Created by polyhy on 2016. 1. 14..
 */


var restaurnatController = {
	validateCheck: (obj)=>{
		var err = {};
		if(!obj.name)errors.teamName = "restaurant name can not be null";
		if(!obj.menu)errors.teamName = "restaurant menus can not be null";
		if(!obj.maxMember)errors.teamName = "max-member can not be null";
		if(!obj.address)errors.teamName = "restaurant address can not be null";
		if(!obj.latlng.lat || !obj.latlng.lat)errors.teamName = "invalid address";
		if(!obj.openTime || !obj.closeTime)errors.teamName = "restaurant opening hour can not be null";
		if(!obj.star)errors.teamName = "rating star can not be null";
		if(!obj.comment)errors.teamName = "comment about restaurant can not be null";
		return err;
	},

	inesrtRestaurnat: function(inputRestaurantInfo){
		var errors = this.validateCheck(inputRestaurantInfo);
		if (_.keys(errors).length < 1)throw new Meteor.Error('invalid-input', errors);

		var restaurantInfo = _.extend(inputRestaurantInfo,{
			createdAt: new Date(),
			createdBy: Meteor.user()._id
		});
	}
};

Meteor.methods(restaurnatController);