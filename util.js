const _ = require("lodash");

module.exports = {
  luck: arr => {
    const index = Math.random() * arr.length;
    return _.nth(arr, index);
  }
};
