const express = require("express");
const { ObjectId } = require("mongodb");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { connectToDb, getDb } = require("./db");
// db connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listing at port 3000");
    });
    db = getDb();
  }
});

app.get("/books", (req, res) => {
  const page = req.query.p || 0;

  const bookPerPage = 3;

  let books = [];
  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * bookPerPage) //it skip book per page*bookPerpage
    .limit(bookPerPage) //limit one time retrieved
    .forEach((book) => {
      books.push(book);
    })
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "couldnt find the books" });
    });
});

app.get("/books/:id", (req, res) => {
  // req.params.id(what ever the name pass ) this give the id of the
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch(() => {
        res.status(500).json({ error: "could not find sth happened" });
      });
  } else {
    res.status(500).json({ error: "It is Invalid !!" });
  }
});
//post /insertion tomongo db
app.post("/books", (req, res) => {
  const book = req.body;
  db?.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "we Y couldnt added values" });
    });
});

//delet the item
app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "we couldnt delete" });
      });
  } else {
    res.status(500).json({ error: "not valid id to delete" });
  }
});

// patch method to update
app.patch("/books/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "couldnt update the book" });
      });
  } else {
    res.status(500).json({ error: "Not valid id to update!!" });
  }
});
