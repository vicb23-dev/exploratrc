exploratrc
El proyecto está dividido en tres partes principales: frontend (aplicación móvil), backend (API) y base de datos.

Tecnologías utilizadas
•	Frontend: Expo + React Native
•	Backend: Node.js + Express
•	Base de datos: PostgreSQL


Estructura del proyecto: 

exploratrc
│
├── app/
│ ├── login.tsx → pantalla de inicio de sesión
│ ├── register.tsx → pantalla de registro de usuarios
│ ├── forgotPassword.tsx → recuperación de contraseña
│ ├── resetPassword.tsx → actualización de contraseña
│ ├── home.tsx → pantalla principal de la aplicación
│ └── _layout.tsx → configuración de navegación de la app
│
├── assets/
│ └── images/ → imágenes y recursos gráficos (logo, íconos, etc.)
│
├── components/
│ → componentes reutilizables de la interfaz de usuario
│
├── services/
│ └── api.js → configuración de la conexión con la API backend
│
├── backend/
│ ├── controllers/
│ │ └── userController.js → lógica de autenticación de usuarios
│ │
│ ├── routes/
│ │ └── userRoutes.js → definición de endpoints de la API
│ │
│ ├── config/
│ │ └── db.js → conexión con la base de datos PostgreSQL
│ │
│ └── server.js → servidor principal de Express
│
├── database/
│ └── database.sql → script de creación de tablas en PostgreSQL
│
├── package.json → dependencias del proyecto
└── README.md → documentación del proyecto






 
Pasos a seguir: 
1.Clonar repo
2.Instalar dependencia
3.Crear base ejecutando database.sql
4.Correr backend
5.Correr Expo

1.Clonar repo
git clone URL_DEL_REPOSITORIO


2.Instalar dependencias 
En terminal: 

del frontend
npm install

del backend
cd backend
npm install

3.Crear una base de datos en PostgreSQL
Se modifica la contraseña local de db.js en config del backend, se abre la carpeta database y se ejecuta el bloque en pgAdmin y automaticamenre se crea la tabla “Usuarios” 

4.correr backend
cd backend
node server.js
5.Iniciar aplicación móvil
en la carpeta raiz del proyecto ejecutar: 

npx expo start

Probar la aplicación

1.Descargar Expo Go en el celular.

2.Escanear el código QR que aparece en la terminal.

3.También es posible abrir la aplicación en el navegador presionando la tecla:w

nota: Asegúrate de que el backend esté corriendo primero en el puerto 5000, ya que la aplicación móvil se conecta a este servidor mediante el archivo: service/ api.js (CHECARLO)
S

-----------------------------------
Módulo de Rutas Temáticas - Explora TRC 

Este módulo añade la funcionalidad de rutas turísticas dinámicas (Gastronomía, Cultura, Night, Entretenimiento y Familiar) conectadas a PostgreSQL.

Scripts de Base de Datos

Es obligatorio ejecutar estos scripts en el orden indicado para que los marcadores de Torreón aparezcan en el mapa:

-- TABLA DE RUTAS (Actividad 1)
CREATE TABLE rutas (
    rut_id SERIAL PRIMARY KEY, -- Identificador único autoincremental [cite: 186]
    rut_nombre VARCHAR(50),    -- Nombre de la experiencia temática [cite: 187]
    rut_descripcion TEXT,      -- Detalle de la ruta [cite: 188]
    rut_color VARCHAR(7)       -- Código hexadecimal para el mapa [cite: 189]
);

-- TABLA DE LUGARES (Actividad 1)
CREATE TABLE lugares (
    lug_id SERIAL PRIMARY KEY,            -- ID único [cite: 166]
    lug_nombre VARCHAR(100) NOT NULL,     -- Nombre del sitio [cite: 167]
    lug_descripcion TEXT,                 -- Información detallada [cite: 168]
    lug_latitud DECIMAL(10, 8),           -- Coordenada exacta [cite: 169]
    lug_longitud DECIMAL(11, 8),          -- Coordenada exacta [cite: 170]
    imagen_principal_url VARCHAR(255),    -- Link a la foto [cite: 171]
    lug_tags TEXT                         -- Etiquetas para el chatbot y búsqueda [cite: 172, 237]
);

-- TABLA INTERMEDIA (Actividad 2)
CREATE TABLE lugares_rutas (
    lug_id INTEGER REFERENCES lugares(lug_id) ON DELETE CASCADE, -- Relación con el lugar [cite: 431]
    rut_id INTEGER REFERENCES rutas(rut_id) ON DELETE CASCADE,   -- Relación con la ruta [cite: 433]
    orden_en_ruta INTEGER,                                       -- Secuencia de visita [cite: 429]
    PRIMARY KEY (lug_id, rut_id)                                 -- Llave primaria compuesta [cite: 430]
);

INSERT INTO rutas (rut_nombre, rut_descripcion, rut_color) VALUES 
('Gastronomica', 'Ruta de sabores típicos de la región de Torreón.', '#FFA500'), -- [cite: 89, 189]
('Cultura', 'Recorrido por museos y sitios históricos emblemáticos.', '#0000FF'), -- [cite: 89, 189]
('Night', 'Vida nocturna, bares y centros de entretenimiento.', '#800080'),       -- [cite: 89, 189]
('Familiar', 'Lugares recreativos ideales para todas las edades.', '#00FF00');    -- [cite: 89, 189]

INSERT INTO rutas (rut_nombre, rut_descripcion, rut_color) VALUES
('Entretenimiento', 'Ruta de diversion en lugares para todo el publico.', '#29dbff');

INSERT INTO lugares (lug_nombre, lug_descripcion, lug_latitud, lug_longitud, lug_tags)
VALUES 
-- CULTURAL
('Museo Arocena', 'Recinto cultural en el antiguo Edificio Casino de la Laguna, con colecciones de arte virreinal y europeo.', 25.54110000, -103.45450000, 'cultura, museo, historia, centro'),
('Teatro Isauro Martínez', 'Considerado uno de los más bellos del país por su arquitectura de estilo neogótico y morisco.', 25.54150000, -103.45120000, 'cultura, teatro, arquitectura, centro'),
('Museo del Ferrocarril', 'Espacio dedicado a la historia ferroviaria que dio origen a la ciudad de Torreón.', 25.53320000, -103.46110000, 'cultura, museo, historia, ferrocarril'),
('Cristo de las Noas', 'El tercer cristo más grande de Latinoamérica, ofrece una vista panorámica de toda la Comarca Lagunera.', 25.52540000, -103.45420000, 'turismo, vista, religion, emblematico'),

-- GASTRONÓMICA
('Mercado Juárez', 'Corazón gastronómico del centro donde se encuentran las tradicionales gorditas y comida regional.', 25.54220000, -103.45780000, 'gastronomia, tradicional, mercado, barato'),
('Distrito Colón', 'Zona de restaurantes y vida social con gran oferta de cortes de carne y cocina internacional.', 25.54180000, -103.44750000, 'gastronomia, cena, social, moderno'),
('La Morelos', 'Avenida peatonal famosa por sus bares, cafés y snacks urbanos.', 25.54080000, -103.45050000, 'gastronomia, cafe, bar, caminata'),

-- FAMILIAR 
('Teleférico Torreón', 'Sistema de transporte aéreo que conecta el Centro Histórico con el Cerro de las Noas.', 25.53910000, -103.45520000, 'familia, turismo, vista, transporte'),
('Bosque Venustiano Carranza', 'El pulmón verde más importante de la ciudad, ideal para correr y convivir en familia.', 25.54550000, -103.43820000, 'familia, deporte, parque, aire libre'),
('Puerto Noas', 'Parque ecológico y recreativo ubicado en la cima del Cerro de las Noas.', 25.52480000, -103.45380000, 'familia, terraza, vista, recreativo'),
('Plaza Mayor', 'Gran explanada cívica rodeada de edificios gubernamentales, ideal para eventos y paseo nocturno.', 25.54410000, -103.45480000, 'familia, centro, explanada, niños'),
('Paseo del Canal de la Perla', 'Antiguo canal de riego subterráneo convertido en galería cultural y comercial.', 25.53980000, -103.45650000, 'turismo, historia, cultura, subterraneo'),

-- NIGHT / VIDA NOCTURNA
('Alameda Zaragoza', 'Parque tradicional que por las noches se llena de puestos de comida y ambiente familiar.', 25.54350000, -103.44450000, 'night, familia, comida, paseo'),
('Estadio Corona (TSM)', 'Casa del Club Santos Laguna, uno de los recintos deportivos más modernos de México.', 25.61750000, -103.38210000, 'entretenimiento, deportes, futbol, santos'),
('Plaza Cuatro Caminos', 'Centro comercial con cine, tiendas y restaurantes para pasar la tarde.', 25.55850000, -103.42420000, 'entretenimiento, compras, cine, familia');

-- ENTRETENIMIENTO
INSERT INTO lugares (lug_nombre, lug_descripcion, lug_latitud, lug_longitud, lug_tags) VALUES 
('Planetarium Torreón', 'Centro de ciencia y tecnología con proyecciones digitales y observatorio astronómico.', 25.5458, -103.4375, 'entretenimiento, ciencia, niños, bosque'),
('Cinemex Platino Cuatro Caminos', 'Complejo de cine con salas premium para disfrutar de los últimos estrenos.', 25.5588, -103.4245, 'entretenimiento, cine, plazas, noche'),
('Jardin de Cerveza (TSM)', 'Área recreativa y social dentro del Territorio Santos Modelo.', 25.6178, -103.3825, 'entretenimiento, futbol, social, noche'),
('Paseo Milex', 'Moderno centro comercial y de oficinas con opciones de ocio y restaurantes.', 25.5890, -103.3950, 'entretenimiento, moderno, compras, comida');

-- ASOCIACIONES PARA RUTA CULTURAL (rut_id = 2)
INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta) VALUES 
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Arocena'), 2, 1),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Teatro Isauro Martínez'), 2, 2),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo del Ferrocarril'), 2, 3),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Paseo del Canal de la Perla'), 2, 4);

-- ASOCIACIONES PARA RUTA GASTRONÓMICA (rut_id = 1)
INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta) VALUES 
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Mercado Juárez'), 1, 1),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Distrito Colón'), 1, 2),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'La Morelos'), 1, 3);

-- ASOCIACIONES PARA RUTA FAMILIAR (rut_id = 4)
INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta) VALUES 
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Teleférico Torreón'), 4, 1),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Cristo de las Noas'), 4, 2),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Puerto Noas'), 4, 3),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Bosque Venustiano Carranza'), 4, 4);

-- ASOCIACIONES PARA RUTA NIGHT (rut_id = 3)
INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta) VALUES 
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Plaza Mayor'), 3, 1),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Alameda Zaragoza'), 3, 2),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Plaza Cuatro Caminos'), 3, 3),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Estadio Corona (TSM)'), 3, 4);

-- ASOCIACIONES PARA ENTRETENIMIENTO 
INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta) VALUES 
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Planetarium Torreón'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Entretenimiento'), 1),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Cinemex Platino Cuatro Caminos'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Entretenimiento'), 2),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Jardin de Cerveza (TSM)'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Entretenimiento'), 3),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Paseo Milex'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Entretenimiento'), 4);

Instrucciones de ejecucion de la rama:

1.Asegúrate de tener instalada la librería para conectar Node con PostgreSQL (Si no, escribe esto en la terminal de la raiz del proyecto):
npm install pg

2. Configuración del Servidor (server.js)
Verifica que los datos de conexión al Pool coincidan con tu configuración local:

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'exploratrc',
  password: 'TU_CONTRASEÑA',
  port: 5432,
});

3. Ejecución
-Inicia el backend: node server.js
-Inicia Expo: npx expo start


