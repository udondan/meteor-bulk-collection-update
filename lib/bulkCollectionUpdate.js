var Fiber = Npm.require("fibers");

bulkCollectionUpdate = function(collection, data, options) {
  
  // set defaults
  var options = options || {};
  options["deleteMissing"] = options["deleteMissing"] || false;
  options["primaryKey"] = options["primaryKey"] || "_id";
  
  // holds all data elements, where the primaryKey is the key - for easy access at the delete routine
  var objByKey = {}; 
  
  // validation of parameters
  if (typeof collection !== "object" || typeof collection._collection !== "object") {
    throw '"collection" is no valid meteor collection';
  }
  if (typeof data !== "object" || Object.prototype.toString.call(data) !== "[object Array]") {
    throw '"data" is not of type array';
  }
  if (typeof options.primaryKey !== "string" || typeof data[0][options.primaryKey] !== "string") {
    throw '"primaryKey" is no valid object property';
  }
  
  Fiber(function () {
    
    // iterate through all elements of data
    _.each(data, function (document) {
      
      // save elements with the primary key as property name for later use
      objByKey[document[options.primaryKey]] = document;
      
      // build the condition for upsert
      var condition = {};
      condition[options.primaryKey] = document[options.primaryKey];
      
      // insert or update, depending on the previosuly built condition (=primaryKey exists)
      collection.upsert(
        condition,
        {
          $set: document
        }
      );
    });
    
    // if we should delete elements which were not contained in data
    if (options.deleteMissing === true) {
      
      //limit returned fields to only _id and the primaryKey
      var fields = {};
      fields[options.primaryKey] = true;
      
      //iterate through all returned documents
      _.each(collection.find({},{ fields: fields }).fetch(), function(document) {
        
        // if document was not contained in data
        if (typeof objByKey[document[options.primaryKey]] === "undefined") {
          
          //delete from collection
          collection.remove(document._id);
        }
      });
    }
    
    // fire callback
    if (typeof options.callback === "function") {
      options.callback();
    }
    
  }).run();
  
};