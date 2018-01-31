Restaurants = new Mongo.Collection("Restaurants");


Restaurants.allow({
  insert: function(){
      return false;
    },
    update: function(){
      return false;
    },
    remove: function(){
      return false;
    }
});

Tables = new Mongo.Collection("Tables");


Tables.allow({
  insert: function(){
      return false;
    },
    update: function(){
      return false;
    },
    remove: function(){
      return false;
    }
});