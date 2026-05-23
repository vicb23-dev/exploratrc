// Aqui se conecta backend con Progestsql

//Local
// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "exploratrc2",
//   password: "Bom54", // tu contraseña
//   port: 5432,
// });

// module.exports = pool;




//NOUDE
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
//Comprobar la coneccion 
pool.query("SELECT current_database()")
  .then((res) => {
    console.log("Base conectada:", res.rows[0]);
  })
  .catch((err) => {
    console.log("ERROR BD:", err.message);
  });

module.exports = pool;

