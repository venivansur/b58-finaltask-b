const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
require("./src/libs/hbs-helper");
const config = require("./config/config");
const { Sequelize, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middlewares/upload-file");

require("dotenv").config();
const environment = process.env.NODE_ENV;
const sequelize = new Sequelize(config[environment]);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./src/views"));

app.use("/assets", express.static(path.join(__dirname, "./src/assets")));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "sangatrahasia",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.get("/", provinsi);

app.get("/login", login);
app.post("/login", loginPost);
app.post("/logout", logoutPost);
app.get("/register", register);
app.post("/register", registerPost);
app.get("/provinsi", provinsi);
app.post("/provinsi", upload.single("image"), provinsiPost);
app.post("/delete-provinsi/:id", provinsiDelete);
app.get("/edit-provinsi/:id", editProvinsi);
app.post("/edit-provinsi/:id", editProvinsiPost);
app.get("/provinsi-detail/:id", provinsiDetail);
app.get("/kabupaten", kabupaten);
app.post("/kabupaten", upload.single("image"), kabupatenPost);
app.post("/delete-kabupaten/:id", kabupatenDelete);
app.get("/edit-kabupaten/:id", editKabupaten);
app.post("/edit-kabupaten/:id", editKabupatenPost);
app.get("/kabupaten-detail/:id", kabupatenDetail);

function login(req, res) {
  res.render("login");
}
async function loginPost(req, res) {
  const { email, password } = req.body;

  const query = `SELECT *  FROM users_tb WHERE email='${email}'`;
  const user = await sequelize.query(query, { type: QueryTypes.SELECT });

  if (!user.length) {
    req.flash("error", "Email / Password Salah");
    return res.redirect("/login");
  }

  const isVerifiedPassword = await bcrypt.compare(password, user[0].password);

  if (!isVerifiedPassword) {
    req.flash("error", "Email / Password Salah");
    return res.redirect("/login");
  }

  req.flash("success", "Berhail Login");
  req.session.user = user[0];
  res.redirect("/");
}

function logoutPost(req, res) {
  req.session.destroy((err) => {
    if (err) return console.error("Logout gagal!");

    console.log("Logout Berhasil");

    res.redirect("/provinsi");
  });
}

function register(req, res) {
  res.render("register");
}

async function registerPost(req, res) {
  const { email, username, password } = req.body;
  const salt = 10;

  const hashedPassword = await bcrypt.hash(password, salt);

  const query = `INSERT INTO users_tb(email, username,  password) VALUES('${email}','${username}','${hashedPassword}')`;
  await sequelize.query(query, { type: QueryTypes.INSERT });

  res.redirect("login");
}

async function provinsi(req, res) {
  const query = `SELECT provinsi_tb.*, users_tb.username AS author FROM provinsi_tb LEFT JOIN users_tb ON provinsi_tb.user_id = users_tb.id`;
  let provinsi_tb = await sequelize.query(query, { type: QueryTypes.SELECT });

  const user = req.session.user;

  res.render("provinsi", { provinsi_tb, user });
}
async function provinsiPost(req, res) {
  const { provinsiName, inaugurated, island } = req.body;

  const { id } = req.session.user;
  const imagePath = req.file.path;

  const query = `INSERT INTO provinsi_tb(
      provinsi_name,
      inaugurated,
      image,
      island,
      user_id) VALUES('${provinsiName}','${inaugurated}','${imagePath}','${island}','${id}')`;

  const provinsi = await sequelize.query(query, { type: QueryTypes.INSERT });

  res.redirect("/provinsi");
}

async function provinsiDelete(req, res) {
  const { id } = req.params;
  const query = `DELETE FROM provinsi_tb WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });

  res.redirect("/provinsi");
}

async function editProvinsi(req, res) {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/login");
  }
  const { id } = req.params;

  const query = `SELECT * FROM provinsi_tb WHERE id=${id}`;
  const provinsi = await sequelize.query(query, { type: QueryTypes.SELECT });
  provinsi[0].author = "Veni Vansurya";

  res.render("edit-provinsi", { provinsi: provinsi[0] });
}

async function editProvinsiPost(req, res) {
  const { provinsiName, inaugurated, island } = req.body;
 
  const { id } = req.params;

  const query = `UPDATE provinsi_tb SET provinsi_name='${provinsiName}', inaugurated='${inaugurated}',island='${island}' WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.UPDATE });

  res.redirect("/provinsi");
}

async function provinsiDetail(req, res) {
  const { id } = req.params;
  const query = `SELECT * FROM provinsi_tb WHERE id = ${id}`;
  const provinsi = await sequelize.query(query, { type: QueryTypes.SELECT });

  provinsi[0].author = "Veni Vansurya";
  res.render("provinsi-detail", { provinsi: provinsi[0] });
}

async function kabupaten(req, res) {
  const query = `
    SELECT 
      kabupaten_tb.*, 
      provinsi_tb.provinsi_name
      
    FROM kabupaten_tb
    LEFT JOIN provinsi_tb 
    ON kabupaten_tb.provinsi_id = provinsi_tb.id
  `;

  const kabupaten_tb = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  const user = req.session.user;

  res.render("kabupaten", { kabupaten_tb, user });
}

async function kabupatenPost(req, res) {
  const { kabupatenName, inaugurated, provinsiName } = req.body;
  const { id } = req.session.user; //
  const imagePath = req.file.path;
  const provinsiQuery = `
      SELECT id FROM provinsi_tb WHERE provinsi_name = :provinsiName LIMIT 1
    `;

  const provinsiResult = await sequelize.query(provinsiQuery, {
    replacements: { provinsiName },
    type: QueryTypes.SELECT,
  });

  if (provinsiResult.length === 0) {
    return res.status(400).json({ error: "Provinsi tidak ditemukan" });
  }

  const provinsiId = provinsiResult[0].id;

  const query = `
      INSERT INTO kabupaten_tb (
        kabupaten_name,
        inaugurated,
        image,
        provinsi_id
        
      ) 
      VALUES(:kabupatenName, :inaugurated, :imagePath, :provinsiId )
    `;

  await sequelize.query(query, {
    replacements: {
      kabupatenName,
      inaugurated,
      imagePath,
      provinsiId,
    },
    type: QueryTypes.INSERT,
  });

  res.redirect("/kabupaten");
}

async function kabupatenDelete(req, res) {
  const { id } = req.params;
  const query = `DELETE FROM kabupaten_tb WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });

  res.redirect("/kabupaten");
}

async function editKabupaten(req, res) {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/login");
  }
  const { id } = req.params;

  const query = `SELECT * FROM kabupaten_tb WHERE id=${id}`;
  const kabupaten = await sequelize.query(query, { type: QueryTypes.SELECT });
  kabupaten[0].author = "Veni Vansurya";

  res.render("edit-kabupaten", { kabupaten: kabupaten[0] });
}

async function editKabupatenPost(req, res) {
  const { kabupatenName, inaugurated } = req.body;

  const { id } = req.params;

  const query = `UPDATE kabupaten_tb SET kabupaten_name='${kabupatenName}', inaugurated='${inaugurated}' WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.UPDATE });

  res.redirect("/kabupaten");
}

async function kabupatenDetail(req, res) {
  const { id } = req.params;
  const query = `SELECT * FROM kabupaten_tb WHERE id = ${id}`;
  const kabupaten = await sequelize.query(query, { type: QueryTypes.SELECT });

  res.render("kabupaten-detail", { kabupaten: kabupaten[0] });
}

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
