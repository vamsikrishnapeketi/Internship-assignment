import express, { query } from "express";
import _ from "lodash";
import fetch from "node-fetch";

const app = express();
const port = 3000;
let tot_no_blogs, longest_title, privacy_blogs;
let arr = [];
let data = [];
let titlesArray = [];
let queryArray = [];
let queryObjects = [];

app.get("/api/blog-stats", (req, res) => {
  const options = {
    method: "GET",
    headers: {
      "x-hasura-admin-secret":
        "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
    },
  };

  fetch("https://intent-kit-16.hasura.app/api/rest/blogs", options)
    .then((response) => response.json())
    .then((response) => {
      data = response.blogs;
      tot_no_blogs = _.size(data);
      longest_title = _.maxBy(data, (blog) => {
        return blog.title.length;
      });
      longest_title = longest_title.title;
      privacy_blogs = _.filter(data, (blog) =>
        _.includes(blog.title.toLowerCase(), "privacy")
      );
      privacy_blogs = _.size(privacy_blogs);
      arr = _.uniqBy(data, "title");
      titlesArray = arr.map((b) => b.title);
    })
    .catch((err) => console.error(err));
});

app.get("/api/blog-search", (req, res) => {
  const options = {
    method: "GET",
    headers: {
      "x-hasura-admin-secret":
        "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
    },
  };

  fetch("https://intent-kit-16.hasura.app/api/rest/blogs", options)
    .then((response) => response.json())
    .then((response) => {
      data = response.blogs;
      let word = req.query.query;
      if (!word) {
        console.log("Enter a proper word");
      } else {
        queryObjects = _.filter(data, (blog) =>
          _.includes(blog.title.toLowerCase(), word.toLowerCase())
        );
        queryArray = queryObjects.map((q) => q.title);
        console.log(`query word is ${word} ,query array is ${queryArray}`);
      }
    })
    .catch((err) => console.error(err));
});

app.listen(port, () => {
  console.log("The Server is running on port 3000");
});
