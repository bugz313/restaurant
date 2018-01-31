UserStatus = new Mongo.Collection("UserStatus");

UserStatus.allow({
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