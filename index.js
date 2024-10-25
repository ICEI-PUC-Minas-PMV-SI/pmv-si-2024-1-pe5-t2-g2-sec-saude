import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import pool from "./database.js";

const app = express();
const porta = 3000;
const today = new Date();
const API_URL = "https://localhost:44374";

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.use(session({
  secret: '111111',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

function isAuthenticated(req, res, next) {
  if (req.session.username) {
    res.locals.username = req.session.username;
    return next();
  } else {
    res.redirect("/area-do-cidadao");
  }
};

//Rotas
app.get("/", (req, res) => {
  res.render("login.ejs", { titulo: "Página Inicial", year: today.getFullYear(), username: req.session.username });
});

app.get("/area-logada-paciente", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/Consultas`);
    res.render("area-logada-paciente.ejs", {  })
  } catch (err) {

  }
});

/*
app.get("/area-do-cidadao", (req,res) => {
  if (req.session.username) {
    res.redirect("/marcacao-de-consulta");
  } else {
    res.render("area-do-cidadao.ejs", { titulo: "Área do Cidadão", year: today.getFullYear(), username: req.session.username });
  }
});

app.get("/marcacao-de-consulta", isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT nome FROM users WHERE username = $1",
      [req.session.username]
    );
    const nome = result.rows[0].nome;
    res.render("marcacao-de-consulta.ejs", {
      titulo: "Marcação de Consulta",
      year: today.getFullYear(),
      usuario: nome,
      username: req.session.username
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao carregar a página de marcação de consulta.");
  }
});

app.get("/cadastro-de-usuario", (req, res) => {
  res.render("cadastro-de-usuario.ejs", { titulo: "Cadastro de Usuário", year: today.getFullYear(), username: req.session.username });
});

//Queries
app.post("/check", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("Username e Password são obrigatórios.");
    return;
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (result.rows.length > 0) {
      const nomeResult = await pool.query(
        "SELECT nome FROM users WHERE username = $1 AND password = $2",
        [username, password]
      );
      req.session.username = username;
      const nome = nomeResult.rows[0].nome;

      res.render("marcacao-de-consulta.ejs", {
        titulo: "Marcação de Consulta",
        year: today.getFullYear(),
        usuario: nome,
        username: req.session.username
      });
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.post("/criar-usuario", async (req, res) => {
  const { username, password, nome, email } = req.body;

  if (!username || !password || !nome || !email) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    await pool.query(
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao criar usuário.");
  }
});

app.get("/gerenciar-conta", isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1", [req.session.username]
    );
    const user = result.rows[0];
    res.render("gerenciar-conta.ejs", { titulo: "Gerenciar Conta", year: today.getFullYear(), usuario: user, username: req.session.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao buscar dados do usuário.");
  }
});

app.post("/atualizar-dados", isAuthenticated, async (req, res) => {
  const { nome, email, password } = req.body;
  const username = req.session.username;

  if (!nome || !email || !password) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    await pool.query(
      "UPDATE users SET nome = $1, email = $2, password = $3 WHERE username = $4", [nome, email, password, username]
    );
    res.send(`
      <p>Dados atualizados com sucesso!</p>
      <script>
        setTimeout(() => {
          window.location.href = "gerenciar-conta";
        }, 3000);
      </script>
    `);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao atualizar dados do usuário.");
  }
});

app.post("/excluir-conta", isAuthenticated, async (req, res) => {
  const username = req.session.username;

  try {
    await pool.query(
      "DELETE FROM users WHERE username = $1", [username]
    );
    req.session.destroy();
    res.send(`
      <p>Conta excluída com sucesso!</p>
      <script>
        setTimeout(() => {
          window.location.href = "/area-do-cidadao";
        }, 3000);
      </script>
    `);
  } catch (err){
    console.error(err.message);
    res.status(500).send("Erro ao excluir conta.");
  }
});

app.get("/logoff", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erro ao fazer logoff.");
    }
    res.redirect("/area-do-cidadao");
  });
});
*/

app.listen(porta, () => {
  console.log(`Listening on port ${porta}`);
});