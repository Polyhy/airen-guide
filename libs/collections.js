Teams = new Mongo.Collection("teams");
Restaurants = new Mongo.Collection("restaurants");

RestaurantImages = new FS.Collection("RestaurantImages", {
	stores: [new FS.Store.GridFS ("RestaurantImages")],
	filter: {
		allow: {
			contentTypes: ['image/*']
		},
		onInvalid: function (message) {
			if (Meteor.isClient){
				throwError(message);
			} else{
				console.log(message);
			}
		}
	}
});

