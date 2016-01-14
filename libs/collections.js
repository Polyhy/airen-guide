RestaurantImages = new FS.Collection("RestaurantImages", {
	stores: [new FS.Store.GridFS ("RestaurantImages")]
});

Teams = new Mongo.Collection("teams");

Restaurants = new Mongo.Collection("restaurants");