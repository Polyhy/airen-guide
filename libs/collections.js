Teams = new Mongo.Collection("teams");
Restaurants = new Mongo.Collection("restaurants");
Crons = new Mongo.Collection("crons");
Todays = new Mongo.Collection("todays");

//RestaurantImages = new FS.Collection("RestaurantImages", {
//	stores: [new FS.Store.GridFS ("RestaurantImages")],
//	filter: {
//		allow: {
//			contentTypes: ['image/*']
//		},
//		onInvalid: function (message) {
//			if (Meteor.isClient){
//				throwError(message);
//			} else{
//				console.log(message);
//			}
//		}
//	}
//});

var RestaurantImageStore  = new FS.Store.GridFS("RestaurantImages", {
	mongoUrl: '', // optional, defaults to Meteor's local MongoDB
	mongoOptions: {}  // optional, see note below
});
RestaurantImages = new FS.Collection("RestaurantImages", {
	stores: [RestaurantImageStore],
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
RestaurantImages.deny({
	insert: function(){
		return false;
	},
	update: function(){
		return false;
	},
	remove: function(){
		return false;
	},
	download: function(){
		return false;
	}
});
RestaurantImages.allow({
	insert: function(){
		return true;
	},
	update: function(){
		return true;
	},
	remove: function(){
		return true;
	},
	download: function(){
		return true;
	}
});
