import express from "express";
import bodyParser from "body-parser";

const app = express();
const porta = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.listen(porta, () => {
  console.log(`Listening on port ${porta}`);
});