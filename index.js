import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "puc-si=e5",
  password: "123456",
  port: 5432,
});

db.connect();

db.query("query", (err, res) => {
  if(err) {

  } else {

  }
  db.end();
});

const app = express();
const porta = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/quem-somos", (req, res) => {
  res.render("quem-somos.ejs");
});

app.get("/unidades", (req, res) => {
  res.render("unidades.ejs");
});

app.get("/contato", (req, res) => {
  res.render("contato.ejs");
});

app.get("/area-do-cidadao", (req,res) => {
  res.render("area-do-cidadao.ejs");
});

app.post("/check", (req, res) => {
  // if(){
  //   res.render("marcacao-de-consulta.ejs");
  // };
});

app.listen(porta, () => {
  console.log(`Listening on port ${porta}`);
});