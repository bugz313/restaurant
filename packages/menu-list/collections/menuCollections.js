Menus = new Mongo.Collection("Menus");


Menus.allow({
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

Categories = new Mongo.Collection("Categories");


Categories.allow({
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

Products = new Mongo.Collection("Products");


Products.allow({
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