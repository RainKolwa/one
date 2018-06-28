const express = require("express");
const _ = require("lodash");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const app = express();
app.use(express.json());

const adapter = new FileSync("db.json");
const db = low(adapter);

//
app.get("/api/luck", (req, res) => {
  const id = _.random(1, 20);
  const post = db
    .get("posts")
    .find({ id })
    .value();
  res.send(post);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
