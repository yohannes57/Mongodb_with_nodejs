const { MongoClient } = require("mongodb");
let dbConnection;
let uri =
  "mongodb+srv://yonni:abcdabcd@cluster0.ridcqg3.mongodb.net/me?retryWrites=true&w=majority";
module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })

      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
