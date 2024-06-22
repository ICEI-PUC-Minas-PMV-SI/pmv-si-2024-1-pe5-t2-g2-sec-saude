import express from "express";
import bodyParser from "body-parser";
import pool from "./database.js";

const app = express();
const porta = 3000;
const today = new Date();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render("index.ejs", { titulo: "Página Inicial", year: today.getFullYear() });
});

app.get("/quem-somos", (req, res) => {
  res.render("quem-somos.ejs", { titulo: "Quem Somos", year: today.getFullYear() });
});

app.get("/unidades", (req, res) => {
  res.render("unidades.ejs", { titulo: "Unidades", year: today.getFullYear() });
});

app.get("/contato", (req, res) => {
  res.render("contato.ejs", { titulo: "Contato", year: today.getFullYear() });
});

app.get("/area-do-cidadao", (req,res) => {
  res.render("area-do-cidadao.ejs", { titulo: "Área do Cidadão", year: today.getFullYear() });
});

app.get("/cadastro-de-usuario", (req, res) => {
  res.render("cadastro-de-usuario.ejs", { titulo: "Cadastro de Usuário", year: today.getFullYear() });
});

app.post("/check", (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) {
    res.status(400).send("Username e Password são obrigatórios.");
    return;
  }

  pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2", [username, password],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("Erro no servidor");
        } else if (result.rows.length > 0) {
          res.render("marcacao-de-consulta.ejs", { titulo: "Marcação de Consulta", year: today.getFullYear() });
        } else {
          res.send(`
            <p>Usuário ou senha incorretos</p>
            <script>
              setTimeout(() => {
                window.location.href = "/area-do-cidadao";
              }, 3000);
            </script>
          `);
        }
      }
    );
});

app.post("/criar-usuario", (req, res) => {
  const { username, password, nome, email } = req.body;

  if (!username || !password || !nome || !email) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  pool.query(
    "INSERT INTO users (username, password, nome, email) VALUES ($1, $2, $3, $4)",
    [username, password, nome, email],
    (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(`
        <p>Erro ao efetuar o cadastro.</p>
        <script>
          setTimeout(() => {
            window.location.href = "/area-do-cidadao";
          }, 3000);
        </script>
      `);
      }
      res.send(`
        <p>Cadastro realizado com sucesso!</p>
        <script>
          setTimeout(() => {
            window.location.href = "/area-do-cidadao";
          }, 3000);
        </script>
      `);  
    }
  );
});

app.listen(porta, () => {
  console.log(`Listening on port ${porta}`);
});