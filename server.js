const express = require("express");
const app = express();
const fs = require("fs");

let articlesRawData = fs.readFileSync("articles.json");
let articles = JSON.parse(articlesRawData);

let countriesRawData = fs.readFileSync("countries.json");
let countries = JSON.parse(countriesRawData);

app.use(express.json());

//Return a list of authors with their articles and country
//GET http://localhost:3000/authors
app.get("/authors", (req, res) => {
  let authorsRawData = fs.readFileSync("authors.json");
  let authors = JSON.parse(authorsRawData);
  let articlesRawData = fs.readFileSync("articles.json");
  let articles = JSON.parse(articlesRawData);
  let countriesRawData = fs.readFileSync("countries.json");
  let countries = JSON.parse(countriesRawData);

  let result = authors.map(author => {
    let articlesResult = articles
      .filter(article => article.author_id == author.id)
      .map(ele => ele.title);
    author.articles = articlesResult;
    let authorCountryCode = author.country_code.toLowerCase();
    author.country = countries[authorCountryCode]
      ? countries[authorCountryCode]
      : "N/A";
    return author;
  });
  res.json(result);
});

//Create a middleware for endpoint “a”, that will look for pagination parameters in the request URL and create an object with it
//GET http://localhost:3000/endpoint_a?page=2&limit=3
app.get("/endpoint_a", paginatedResults(), (req, res) => {
  res.json(req.paginatedResults);
});

//Add a new article with an author that might or might now exist
// POST http://localhost:3000/articles HTTP/1.1
// content-type: application/json
// {
//     "author_name": "Joao",
//     "title": "Article 5"
// }
app.post("/articles", (req, res) => {
  let authorsRawData = fs.readFileSync("authors.json");
  let authors = JSON.parse(authorsRawData);
  let articlesRawData = fs.readFileSync("articles.json");
  let articles = JSON.parse(articlesRawData);

  let maxArticleindex = Math.max(...articles.map(user => user.id));
  let maxAuthorIndex;

  let author = authors.find(
    author => req.body.author_name == author.author_name
  );
  if (!author) {
    maxAuthorIndex = Math.max(...authors.map(user => user.id));
    let newAuthor = {
      id: maxAuthorIndex + 1,
      name: req.body.author_name,
      country_code: ""
    };
    authors.push(newAuthor);
    let data = JSON.stringify(authors);
    fs.writeFileSync("authors.json", data, "utf8");
  }

  let newArticle = {
    id: maxArticleindex + 1,
    author_id: maxAuthorIndex + 1,
    title: req.body.title
  };

  articles.push(newArticle);

  let data = JSON.stringify(articles);
  fs.writeFileSync("articles.json", data, "utf8");
  res.json(articles);
});

//Update one or multiple articles title
// POST http://localhost:3000/update-bulk/articles HTTP/1.1
// content-type: application/json

// [
//     {
//     "id": 1,
//     "title": "Updated 1"
// },
// {
//     "id": 2,
//     "title": "Updated 2"
// }
// ]
app.post("/update-bulk/articles", (req, res) => {
  let articlesRawData = fs.readFileSync("articles.json");
  let articles = JSON.parse(articlesRawData);

  articles.forEach(article => {
    req.body.forEach(reqBodyElement => {
      if (article.id == reqBodyElement.id) {
        article.title = reqBodyElement.title
          ? reqBodyElement.title
          : article.title;
      }
    });
  });

  let data = JSON.stringify(articles);
  fs.writeFileSync("articles.json", data, "utf8");
  res.json(articles);
});

// Delete one or multiple articles
// POST http://localhost:3000/delete-bulk/articles HTTP/1.1
// content-type: application/json

// [
//     {
//     "id": 2

// },
// {
//     "id": 3

// },
// {
//     "id": 7

// }
// ]
app.post("/delete-bulk/articles", (req, res) => {
  let articlesRawData = fs.readFileSync("articles.json");
  let articles = JSON.parse(articlesRawData);

  let indexesToDelete = [];
  articles.forEach((article, index) => {
    req.body.forEach(reqBodyElement => {
      if (article.id == reqBodyElement.id) {
        indexesToDelete.push(index);
      }
    });
  });

  for (let i = indexesToDelete.length - 1; i >= 0; i--)
    articles.splice(indexesToDelete[i], 1);

  let data = JSON.stringify(articles);
  fs.writeFileSync("articles.json", data, "utf8");
  res.json(articles);
});

function paginatedResults() {
  return (req, res, next) => {
    let authorsRawData = fs.readFileSync("authors.json");
    let authors = JSON.parse(authorsRawData);
    req.paginatedResults = {};

    if (!req.query.page || !req.query.limit) {
      req.paginatedResults.results = authors;
      next();
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    req.paginatedResults.results = authors.slice(startIndex, endIndex);
    next();
  };
}

app.listen(process.env.PORT || 3000);
