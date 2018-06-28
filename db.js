const axios = require("axios");
const _ = require("lodash");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const ENDPOINT = "http://v3.wufazhuce.com:8000/api";

// 初始值
db.defaults({ posts: [] }).write();

// 根据id获取文章
const fetchPost = async id => {
  const {
    data: { data: one }
  } = await axios.get(`${ENDPOINT}/onelist/${id}/0`);
  const post = {
    id,
    date: one.date,
    list: _.get(one, "content_list", []).map(content => {
      const { id, title, forward, img_url, author } = content || {};
      return {
        id,
        title,
        forward,
        img_url,
        author
      };
    })
  };
  return post;
};

// 从1～4000获取文章
const createDb = () => {
  _.range(1, 360).forEach(async id => {
    const result = db
      .get("posts")
      .find({ id })
      .value();
    // console.log(result);
    if (result && !_.isEmpty(result)) {
      return;
    }
    const post = await fetchPost(id + 1);
    db.get("posts")
      .push(post)
      .write();
  });
  console.log("Db is up to date");
};

createDb();
