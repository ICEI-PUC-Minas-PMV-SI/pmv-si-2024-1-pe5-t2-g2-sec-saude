import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import pool from "./database.js";

const app = express();
const porta = 3000;
const today = new Date();
const API_URL = "https://localhost:44374";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJBZG1pbmlzdHJhZG9yIiwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20uYnIiLCJyb2xlIjoiQWRtaW5pc3RyYWRvciIsIm5iZiI6MTcyNzQ1NDkxNiwiZXhwIjoxNzI3NDgzNzE2LCJpYXQiOjE3Mjc0NTQ5MTZ9.rtoll98kyGoG8ECkQI2m18jBcOoR3wIYzsby3l2J0_M";

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
  res.render("marcar-consulta.ejs", { titulo: "Página Inicial", year: today.getFullYear(), usuario: "teste", data: "25/12", horario: "12:00", medico: "Dr.", especialidade: "açougueiro" });
});

app.post("/check", async (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];
  
  try {
    const response = await axios.get(`${API_URL}/api/Usuarios`);
    response.forEach(user => {
      if(user.email === email) {
        if(user.senha === password) {
          usuario = { user };
        }
      } 
    }
  );

  switch (usuario.perfil) {
    case 0:
      res.render("area-logada-administrador.ejs");
      break;
    
    case 1:
      res.render("area-logada-medico.ejs");
      break;
    
    case 2:
      res.render("area-logada-paciente.ejs");
      break;

    default:
      break;
  }
  } catch (error) {
    console.log(error);
  }

});

app.get("/area-logada-paciente", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/Consultas`);
    res.render("area-logada-paciente.ejs", { titulo: "Área Paciente", year: today.getFullYear(), usuario: "Teste",  data: response.dataConsulta, horario: response.horaConsulta, medico: "", especialidade: "" })
  } catch (err) {
    console.log(err);
  }
});

app.get("/area-logada-administrador", async (req, res) => {
  try {
    const response1 = await axios.get(`${API_URL}/api/Usuarios`);
    const response2 = await axios.get(`${API_URL}/api/Medicos`);
    const response3 = await axios.get(`${API_URL}/api/Consultas`);

    res.render("area-logada-administrador.ejs", { titulo: "Área Administrador", year: today.getFullYear(), usuarios: response1.length, medicos: response2.length, consultas: response3.length });
  } catch (err) {
    console.log(err);
  }
});

app.get("/area-logada-medico", async (req, res) => {
  try {
    const response1 = await axios.get(`${API_URL}/api/Usuarios`);
    const response2 = await axios.get(`${API_URL}/api/Medicos`);
    const response3 = await axios.get(`${API_URL}/api/Consultas`);

    res.render("area-logada-medico.ejs", { titulo: "Área Médico", year: today.getFullYear() });
  } catch (err) {
    console.log(err);
  }
});

app.get("/marcar-consulta", async (req, res) => {
  res.render("marcar-consulta.ejs");
});

app.post("/marcar-consulta", async (req, res) => {
  // const especialidade = req.body["especialidade"];
  // const medico = req.body["medico"];
  // const consulta = req.body["consulta"];

  // const envio = await axios.post(`${API_URL}/api/Consultas`);
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