var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var WEDDINGS_COLLECTION = "weddings";

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/weddings"
 *    GET: finds all weddings
 *    POST: creates a new wedding
 */

app.get("/api/weddings", function(req, res) {
  db.collection(WEDDINGS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get weddings.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/weddings", function(req, res) {
  var newWedding = req.body;
  newWedding.createDate = new Date();

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  } else {
    db.collection(WEDDINGS_COLLECTION).insertOne(newWedding, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new wedding.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});


/*  "/api/weddings/:id"
 *    GET: find wedding by id
 *    PUT: update wedding by id
 *    DELETE: deletes wedding by id
 */

app.get("/api/weddings/:id", function(req, res) {
});

app.put("/api/weddings/:id", function(req, res) {
});

app.delete("/api/weddings/:id", function(req, res) {
});
