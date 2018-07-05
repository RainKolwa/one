const express = require("express");
const _ = require("lodash");
const axios = require("axios");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { toh_key } = require("./config.js");

const app = express();
app.use(express.json());

const adapter = new FileSync("db.json");
const db = low(adapter);

// one一个
app.get("/api/luck", (req, res) => {
  const id = _.random(1, 360);
  const post = db
    .get("posts")
    .find({ id })
    .value();
  res.send(post);
});

// 历史上的今天
app.get("/api/toh", async (req, res) => {
  const { month, day } = req.query || {};
  const { data } = await axios.get(
    `http://v.juhe.cn/todayOnhistory/queryEvent.php?key=${toh_key}&date=${month}/${day}`
  );
  res.send(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
