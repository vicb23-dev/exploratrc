CREATE TABLE usuarios (
 id SERIAL PRIMARY KEY,
 nombre VARCHAR(100),
 email VARCHAR(100) UNIQUE,
 password TEXT,
 rol VARCHAR(20) DEFAULT 'usuario'
);

SELECT * FROM usuarios;