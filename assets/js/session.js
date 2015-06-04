var Session = window.Session = function() {
  var self = {},
      storage = {};

  self.set = function(attrName, value) {
    storage[attrName] = value;
  }

  self.get = function(attrName){
    return storage[attrName];
  }

  self.toJSON = function(){
    return storage;
  }

  return self;
}
