bulkCollectionUpdate
===============

__NO LONGER MAINTAINED__

`bulkCollectionUpdate` is a quick way to update/replace the whole content of a collection with the content of an array. A use case (and why I created this) is to store a cached version of external content such as a RSS feed or the result of a JSON API which then can easily be updated (insert new, delete old and update existing documents).

By default the `_id` field is used as the primary identifier. Since this ID in many cases is not contained within the source data you can define any document property as the `primaryKey`. In the below example the field `email` will be used.

The delete option should not be used for really large datasets, as all documents (but only the `primaryKey` field) will be fetched from the collection!


## Installation
``` sh
$ meteor add udondan:bulk-collection-update
```
The module is registered in the [Atmosphere](https://atmospherejs.com/udondan/bulk-collection-update) repository.


## Usage

`bulkCollectionUpdate(collection, data, [options])`

### Parameters

#### collection
Must be a Meteor collection object, not only the name (`new Meteor.Collection(...)`)

#### data
Must be an array, containing the objects which will be stored in the collection

#### options
Object containing optional parameters, which are:

**primaryKey:** The document/object property which will be used to identify a document as unique. Both, the document in the collection and the object in `data` need to have this property. **Default:** `_id`

**deleteMissing:** Only if this is set to `true`, documents which are not contained in `data` will be deleted from the collection. **Default:** `false`

**callback:** A callback function which will be executed after `data` was written to the collection.

## Examples

### Insert data
``` js
// Define some data you want to insert.
// Each element will be added (or updated) as a document to the collection
var data = [
  {
    firstName: "Daniel",
    lastName:  "Schroeder",
    email:     "daniel.phatthanan@example.com"
  },
  {
    firstName: "Carl",
    lastName:  "Jennings",
    email:     "carl.jennings@example.com"
  }
];

// define the collection
var students = new Meteor.Collection("students");

// bulk insert the data. The field email will be used as primary identifier for the records
bulkCollectionUpdate(students, data, {
  primaryKey: "email",
  callback: function() {
    console.log("Done. Collection now has " + students.find().count() + " documents.");
  }
});
```
Both elements are now inserted in the collection.

### Update data
Updating data is the exact same as inserting new data. If there is no element with a matching `primaryKey`, a new document will be created. If a matching document was found it will be updated.

``` js
// update a document, first in the data array...
data[0].lastName = "Phatthanan";

// ...then again write in bulk to the collection
bulkCollectionUpdate(students, data, {
  primaryKey: "email",
  callback: function() {
    console.log("Collection updated.");
  }
});
```

### Deleting data
To delete data, you need to set the option `deleteMissing` to true. By default `bulkCollectionUpdate` will never delete documents from a collections.


``` js
delete data[1];
// now there is only 1 element in data left

// WRONG: this will NOT work, as the option deleteMissing is not set
bulkCollectionUpdate(students, data, {
  primaryKey: "email",
  callback: function() {
    console.log("Nothing happened!");
  }
});

// CORRECT: you have to set deleteMissing to true
bulkCollectionUpdate(students, data, {
  primaryKey: "email",
  deleteMissing: true,
  callback: function() {
    console.log("Done. Collection now has " + students.find().count() + " document.");
  }
});
```
Now there is only 1 document left in the `students` collection.

Passing an empty array would clear the whole collection:

``` js
bulkCollectionUpdate(students, [], {
  primaryKey: "email",
  deleteMissing: true,
  callback: function() {
    console.log("Done. Collection now has " + students.find().count() + " documents.");
  }
});
```
But it's not recommended to use this to clear a collection, as each document will be deleted separately. If you want to drop all data, use `collection.remove({})` instead.


### Complete example for easy copy & paste

``` js
// Define some data you want to insert.
// Each element will be added (or updated) as a document to the collection
var data = [
  {
    firstName: "Daniel",
    lastName:  "Schroeder",
    email:     "daniel.phatthanan@example.com"
  },
  {
    firstName: "Carl",
    lastName:  "Jennings",
    email:     "carl.jennings@example.com"
  }
];

// define the collection
var students = new Meteor.Collection("students");

var insertData = function() {
  // bulk insert the data. The field email will be used as primary identifier for the records
  bulkCollectionUpdate(students, data, {
    primaryKey: "email",
    callback: function() {
      console.log("Done. Collection now has " + students.find().count() + " documents.");
      updateData();
    }
  });
}

var updateData = function() {
  // update a document, first in the data array...
  data[0].lastName = "Phatthanan";
  
  // ...then again write in bulk to the collection
  bulkCollectionUpdate(students, data, {
    primaryKey: "email",
    callback: function() {
      console.log("Collection updated.");
      deleteData();
    }
  });
}

var deleteData = function() {
  delete data[1];
  // now there is only 1 element in data left
  
  // WRONG: this will NOT work, as the option deleteMissing is missing
  bulkCollectionUpdate(students, data, {
    primaryKey: "email",
    callback: function() {
      console.log("Nothing happened!");
    }
  });
  
  // CORRECT: you have to set deleteMissing to true
  bulkCollectionUpdate(students, data, {
    primaryKey: "email",
    deleteMissing: true,
    callback: function() {
      console.log("Done. Collection now has " + students.find().count() + " document.");
    }
  });
}

insertData();
```
