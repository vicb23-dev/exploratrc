// Aqui se conecta backend con Progestsql
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "exploratrc",
  password: "Bom54", // tu contraseña
  port: 5432,
});

module.exports = pool;
