var Session = window.Session = function() {
  var self = {},
      db = {};

  self.set = function(attrName, value) {
    db[attrName] = value;
  }

  self.get = function(attrName){
    return db[attrName];
  }

  self.toJSON = function(){
    return db;
  }

  return self;
}
