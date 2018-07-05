const express = require("express");
const _ = require("lodash");
const axios = require("axios");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { toh_key } = require("./config.js");
const { luck } = require("./util");

const app = express();
app.use(express.json());

const db = low(new FileSync("db.json"));
const db_toh = low(new FileSync("toh.json"));
db_toh.defaults({ posts: [] }).write();

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
  const date = `${month}/${day}`;
  const posts = db_toh
    .get("posts")
    .filter({ day: date })
    .value();
  if (posts.length) {
    const post = luck(posts);
    res.send(post);
  } else {
    const { data } = await axios.get(
      `http://v.juhe.cn/todayOnhistory/queryEvent.php?key=${toh_key}&date=${date}`
    );
    if (data.error_code === 0) {
      const list = data.result;
      const post = luck(list);
      res.send(post);
      _.forEach(list, item => {
        const event = db_toh
          .get("posts")
          .find({ e_id: item.e_id })
          .value();
        if (!event) {
          db_toh
            .get("posts")
            .push(item)
            .write();
        }
      });
    } else {
      res.send({
        error_code: data.error_code,
        reason: data.reason
      });
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
