CREATE TABLE usuarios (
 id SERIAL PRIMARY KEY,
 nombre VARCHAR(100),
 email VARCHAR(100) UNIQUE,
 password TEXT,
 rol VARCHAR(20) DEFAULT 'usuario'
);

SELECT * FROM usuarios;

CREATE TABLE rutas (
    rut_id SERIAL PRIMARY KEY, -- Identificador único autoincremental [cite: 186]
    rut_nombre VARCHAR(50),    -- Nombre de la experiencia temática [cite: 187]
    rut_descripcion TEXT,      -- Detalle de la ruta [cite: 188]
    rut_color VARCHAR(7)       -- Código hexadecimal para el mapa [cite: 189]
);

CREATE TABLE lugares (
    lug_id SERIAL PRIMARY KEY,            -- ID único [cite: 166]
    lug_nombre VARCHAR(100) NOT NULL,     -- Nombre del sitio [cite: 167]
    lug_descripcion TEXT,                 -- Información detallada [cite: 168]
    lug_latitud DECIMAL(10, 8),           -- Coordenada exacta [cite: 169]
    lug_longitud DECIMAL(11, 8),          -- Coordenada exacta [cite: 170]
    imagen_principal_url VARCHAR(255),    -- Link a la foto [cite: 171]
    lug_tags TEXT                         -- Etiquetas para el chatbot y búsqueda [cite: 172, 237]
);

CREATE TABLE lugares_rutas (
    lug_id INTEGER REFERENCES lugares(lug_id) ON DELETE CASCADE, -- Relación con el lugar [cite: 431]
    rut_id INTEGER REFERENCES rutas(rut_id) ON DELETE CASCADE,   -- Relación con la ruta [cite: 433]
    orden_en_ruta INTEGER,                                       -- Secuencia de visita [cite: 429]
    PRIMARY KEY (lug_id, rut_id)                                 -- Llave primaria compuesta [cite: 430]
);

-- ==========================================
-- EXPERIENCIAS DENTRO DE CADA RUTA
-- ==========================================

CREATE TABLE experiencias_rutas (
    exp_id SERIAL PRIMARY KEY,
    rut_id INTEGER NOT NULL,
    exp_nombre VARCHAR(100) NOT NULL,
    exp_descripcion TEXT,
    exp_imagen_url VARCHAR(255),

    FOREIGN KEY (rut_id)
    REFERENCES rutas(rut_id)
    ON DELETE CASCADE
);

CREATE TABLE experiencias_lugares (
    id SERIAL PRIMARY KEY,
    exp_id INTEGER NOT NULL,
    lug_id INTEGER NOT NULL,
    momento VARCHAR(50) NOT NULL,
    orden_en_experiencia INTEGER NOT NULL,

    FOREIGN KEY (exp_id)
    REFERENCES experiencias_rutas(exp_id)
    ON DELETE CASCADE,

    FOREIGN KEY (lug_id)
    REFERENCES lugares(lug_id)
    ON DELETE CASCADE,

    UNIQUE (exp_id, lug_id)
);

SELECT * FROM experiencias_rutas;
SELECT * FROM experiencias_lugares;

INSERT INTO rutas (rut_nombre, rut_descripcion, rut_color) VALUES 
('Gastronomica', 'Ruta de sabores típicos de la región de Torreón.', '#FFA500'), -- [cite: 89, 189]
('Cultura', 'Recorrido por museos y sitios históricos emblemáticos.', '#0000FF'), -- [cite: 89, 189]
('Night', 'Vida nocturna, bares y centros de entretenimiento.', '#800080'),       -- [cite: 89, 189]
('Familiar', 'Lugares recreativos ideales para todas las edades.', '#00FF00');    -- [cite: 89, 189]

INSERT INTO rutas (rut_nombre, rut_descripcion, rut_color) VALUES
('Entretenimiento', 'Ruta de diversion en lugares para todo el publico.', '#29dbff');


INSERT INTO experiencias_rutas (rut_id, exp_nombre, exp_descripcion)
VALUES
(
 (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Gastronomica'),
 'Día gastronómico clásico',
 'Recorrido completo desde desayuno hasta cena con lugares representativos.'
),
(
 (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Gastronomica'),
 'Plan dulce y café',
 'Experiencia enfocada en cafeterías, postres y lugares tranquilos.'
),
(
 (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Gastronomica'),
 'Ruta familiar',
 'Lugares cómodos y accesibles para disfrutar en familia durante todo el día.'
),
(
 (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Gastronomica'),
 'Antojitos laguneros',
 'Ruta de comida casual, tacos y sabores típicos de la región.'
),
(
 (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Gastronomica'),
 'Cena y convivencia',
 'Experiencia pensada para tarde-noche con cena y ambiente social.'
);

INSERT INTO experiencias_rutas (rut_id, exp_nombre, exp_descripcion)
VALUES
((SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 'Noche con amigos', 'Plan para convivir, comer y terminar en un ambiente de fiesta.'),

((SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 'Noche de cócteles', 'Experiencia para cenar y disfrutar bebidas en lugares con ambiente especial.'),

((SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 'Karaoke y despecho', 'Ruta pensada para cantar, convivir y pasar una noche divertida.'),

((SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 'Cena y ambiente tranquilo', 'Plan nocturno más relajado, ideal para cenar y platicar.');


INSERT INTO experiencias_rutas (rut_id, exp_nombre, exp_descripcion)
VALUES
((SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Familiar'), 'Día al aire libre', 'Naturaleza, paseo y actividades para disfrutar en familia.'),
((SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Familiar'), 'Diversión extrema', 'Juegos, trampolines y videojuegos para todas las edades.'),
((SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Familiar'), 'Tarde infantil', 'Espacio ideal para niños con juegos y cafetería.');
SELECT exp_id, exp_nombre
FROM experiencias_rutas
WHERE rut_id = (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night')
ORDER BY exp_id;
DELETE FROM experiencias_rutas
WHERE exp_id IN (10,11,12,13);



SELECT exp_id, exp_nombre
FROM experiencias_rutas
WHERE rut_id = (
  SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Familiar'
)
ORDER BY exp_id;
INSERT INTO experiencias_lugares (exp_id, lug_id, momento, orden_en_experiencia)
VALUES
(1, (SELECT lug_id FROM lugares WHERE lug_nombre ILIKE 'Apapacho'), 'Desayuno', 1),
(1, (SELECT lug_id FROM lugares WHERE lug_nombre ILIKE 'Casa Nalo'), 'Comida', 2),
(1, (SELECT lug_id FROM lugares WHERE lug_nombre ILIKE 'The Cookie Lab'), 'Postre', 3),
(1, (SELECT lug_id FROM lugares WHERE lug_nombre ILIKE 'Tacos el Kampeon'), 'Cena', 4);

INSERT INTO experiencias_lugares (exp_id, lug_id, momento, orden_en_experiencia)
VALUES
(2, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Dulce’s Bakery'), 'Desayuno', 1),
(2, (SELECT lug_id FROM lugares WHERE lug_nombre = 'ZAO'), 'Comida', 2),
(2, (SELECT lug_id FROM lugares WHERE lug_nombre = 'The Cookie Lab'), 'Postre', 3),
(2, (SELECT lug_id FROM lugares WHERE lug_nombre = 'El Rayo Taquería'), 'Cena', 4),

(3, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Santo Café'), 'Desayuno', 1),
(3, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Riviera'), 'Comida', 2),
(3, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Dulce’s Bakery'), 'Postre', 3),
(3, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Rooster Wings'), 'Cena', 4),

(4, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Mercado Juárez'), 'Desayuno', 1),
(4, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Tacos el Kampeon'), 'Comida', 2),
(4, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Santo Café'), 'Postre / Café', 3),
(4, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Pozole Don Beto y Gorditas Chelo'), 'Cena', 4),

(5, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Grazie'), 'Desayuno', 1),
(5, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Sr Kimono'), 'Comida', 2),
(5, (SELECT lug_id FROM lugares WHERE lug_nombre = 'The Cookie Lab'), 'Postre', 3),
(5, (SELECT lug_id FROM lugares WHERE lug_nombre = 'ZAO'), 'Cena', 4)
ON CONFLICT DO NOTHING;

INSERT INTO experiencias_lugares (exp_id, lug_id, momento, orden_en_experiencia)
VALUES
-- NOCHE CON AMIGOS
(6, (SELECT lug_id FROM lugares WHERE lug_nombre = 'La Chabela Food Park'), 'Cena / Snacks', 1),
(6, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Punto Guerrero'), 'Drinks', 2),
(6, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Drums'), 'Fiesta', 3),

-- NOCHE DE CÓCTELES
(7, (SELECT lug_id FROM lugares WHERE lug_nombre = 'VICENTE Asador de Brasa'), 'Cena', 1),
(7, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Yasuko'), 'Cócteles', 2),
(7, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Madison'), 'Ambiente nocturno', 3),

-- KARAOKE Y DESPECHO
(8, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Sala de Despecho'), 'Karaoke', 1),
(8, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Despecho'), 'Música / Fiesta', 2),
(8, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Drums'), 'After', 3),

-- CENA Y AMBIENTE TRANQUILO
(9, (SELECT lug_id FROM lugares WHERE lug_nombre = 'VICENTE Asador de Brasa'), 'Cena', 1),
(9, (SELECT lug_id FROM lugares WHERE lug_nombre = 'La Chabela Food Park'), 'Convivencia', 2),
(9, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Yasuko'), 'Cócteles', 3)
ON CONFLICT DO NOTHING;

INSERT INTO experiencias_lugares
(exp_id, lug_id, momento, orden_en_experiencia)
VALUES

-- Día al aire libre
(14, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Bosque Urbano'), 'Paseo', 1),
(14, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Aviario Lira'), 'Naturaleza', 2),

-- Diversión extrema
(15, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Fly Jump'), 'Actividad', 1),
(15, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Galex Game Center'), 'Videojuegos', 2),

-- Tarde infantil
(16, (SELECT lug_id FROM lugares WHERE lug_nombre = 'Pikabuu'), 'Juegos y cafetería', 1)

ON CONFLICT DO NOTHING;



SELECT 
  er.exp_nombre,
  l.lug_nombre,
  el.momento
FROM experiencias_lugares el
JOIN experiencias_rutas er ON el.exp_id = er.exp_id
JOIN lugares l ON el.lug_id = l.lug_id
WHERE er.exp_id IN (14,15,16)
ORDER BY er.exp_id, el.orden_en_experiencia;
SELECT 
  er.exp_nombre,
  l.lug_nombre,
  el.momento,
  el.orden_en_experiencia
FROM experiencias_lugares el
JOIN experiencias_rutas er ON el.exp_id = er.exp_id
JOIN lugares l ON el.lug_id = l.lug_id
ORDER BY er.exp_id, el.orden_en_experiencia;

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


--IMAGENES 
UPDATE lugares SET imagen_principal_url = 'https://www.torreon.gob.mx/turismo/img/qr/04%20Museo%20Arocena.jpg'
WHERE lug_nombre = 'Museo Arocena';

UPDATE lugares SET imagen_principal_url = 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGXcvEBpRQcuYNyklmIRSNGNhDcYQQCg64G1tXmkFzTR1ebrkj70w0YEl0EZki7DB5Nid0TejRXTctMKXqRyu4J0aTevR8JNdN3HeAY-Y-ZkyFQHMDGv01gODlUkza4wMNbmHhFzg=s1360-w1360-h1020-rw'
WHERE lug_nombre = 'Teatro Isauro Martínez';

UPDATE lugares SET imagen_principal_url = 'https://sic.cultura.gob.mx/imagenes_cache/museo_1362_i_61382.png'
WHERE lug_nombre = 'Museo del Ferrocarril';

UPDATE lugares SET imagen_principal_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu0wOQ6k98BnzD4DtWexmMKbHRHnfSbjU9SQ&s'
WHERE lug_nombre = 'Cristo de las Noas';

UPDATE lugares SET imagen_principal_url = 'https://cdn.milenio.com/uploads/media/2017/09/29/mercado-juarez-torreon-cumplio-anos.jpg'
WHERE lug_nombre = 'Mercado Juárez';

UPDATE lugares SET imagen_principal_url = 'https://tecolotito.elsiglodetorreon.com.mx/i/2015/10/764144.jpeg'
WHERE lug_nombre = 'Distrito Colón';

UPDATE lugares SET imagen_principal_url = 'https://panchito-kardashian.tar.mx/media/2017/04/paseo_morelos_torreon.jpg'
WHERE lug_nombre = 'La Morelos';

UPDATE lugares SET imagen_principal_url = 'https://www.noticierosgrem.com.mx/wp-content/uploads/2017/12/TELEFERICO-GONDOLAS.jpeg'
WHERE lug_nombre = 'Teleférico Torreón';

UPDATE lugares SET imagen_principal_url = 'https://tecolotito.elsiglodetorreon.com.mx/i/2021/09/1481728.jpeg'
WHERE lug_nombre = 'Bosque Venustiano Carranza';

UPDATE lugares SET imagen_principal_url = 'https://www.aquilaguna.com/wp-content/uploads/2025/12/003-TELEFERICO-DE-TORREON-Y-PUERTO-NOAS-PROYECTAN-UNA-GRAN-AFLUENCIA-PARA-CERRAR-EL-2025-.jpeg'
WHERE lug_nombre = 'Puerto Noas';

UPDATE lugares SET imagen_principal_url = 'https://miqueridotorreon.com/wp-content/uploads/2024/08/IMG_1538-1296x700.jpeg'
WHERE lug_nombre = 'Plaza Mayor';

UPDATE lugares SET imagen_principal_url = 'https://mxc.com.mx/wp-content/uploads/2021/12/64641084_451255405700898_6984284235478983489_n-1.jpg'
WHERE lug_nombre = 'Paseo del Canal de la Perla';

UPDATE lugares SET imagen_principal_url = 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/de/3e/4a/alameda-zaragoza.jpg'
WHERE lug_nombre = 'Alameda Zaragoza';

UPDATE lugares SET imagen_principal_url = 'https://www.hksinc.com/wp-content/uploads/2018/10/estadio_tsm_corona_B-1.jpg'
WHERE lug_nombre = 'Estadio Corona (TSM)';

UPDATE lugares SET imagen_principal_url = 'https://cdn2.telediario.mx/uploads/media/2019/09/28/cuatro_caminos.jpg'
WHERE lug_nombre = 'Plaza Cuatro Caminos';

UPDATE lugares SET imagen_principal_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWlmsacYcfcGdfFej3jc00nx6E6033qMFrYg&s'
WHERE lug_nombre = 'Planetarium Torreón';

UPDATE lugares SET imagen_principal_url = 'https://tecolotito.elsiglodetorreon.com.mx/i/2019/09/1221122.jpeg'
WHERE lug_nombre = 'Cinemex Platino Cuatro Caminos';

UPDATE lugares SET imagen_principal_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScXmrGP8wuM9DK_gZy68BwWJBHFBErdoSrHQ&s'
WHERE lug_nombre = 'Jardin de Cerveza (TSM)';

UPDATE lugares SET imagen_principal_url = 'https://paseomilex.com/wp-content/uploads/2021/02/rsz_1img_3395.jpg'
WHERE lug_nombre = 'Paseo Milex';

-- ==========================================
-- NUEVOS LUGARES GASTRONÓMICOS
-- ==========================================

INSERT INTO lugares (
  lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags
) VALUES
('The Cookie Lab', 'Dulcería especializada en una variedad de postres tentadores.', 25.5525, -103.4299, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/cookie_lab_sg9fjj', 'gastronomia, postres, dulce, cafe, brunch, familiar'),

('Tacos el Kampeon', 'Restaurante mexicano con el verdadero sello lagunero, amigable y familiar.', 25.5440, -103.4551, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/kampeon_mhvxde', 'gastronomia, tacos, comida mexicana, centro, familiar'),

('Rooster Wings', 'Negocio lagunero de boneless, alitas y papas, bien calientitos y doraditos.', 25.5443, -103.4543, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/Rooster_k56dq4', 'gastronomia, alitas, boneless, comida casual, centro'),

('ZAO', 'Cocina oriental y coctelería molecular y artesanal.', 25.5428, -103.4557, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/zao_wmqe1w', 'gastronomia, sushi, oriental, ramen, cocteleria'),

('Grazie', 'Cafetería restaurante con variedad de comida y bebidas para todos los gustos.', 25.5718, -103.4109, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/grazie_hzo83b', 'gastronomia, cafeteria, brunch, bebidas, moderno'),

('Casa Nalo', 'Cocina de autor con un toque que hace la diferencia.', 25.5427, -103.4562, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/casa_nalo_ybn8bz', 'gastronomia, autor, brunch, cafe, centro'),

('Riviera', 'Comida de mar con sabores inolvidables.', 25.5305, -103.3959, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/riviera_pmb2hw', 'gastronomia, mariscos, comida de mar, restaurante'),

('Apapacho', 'Café y brunch con café hecho con amor.', 25.5429, -103.4560, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/apap_kmbyrw', 'gastronomia, cafe, brunch, desayuno, centro'),

('Sr Kimono', 'Sushi, ramen, teppanyaki y más.', 25.5689, -103.4123, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/sr_kimono_nnifk9', 'gastronomia, sushi, ramen, japones'),

('Bonxi', 'Menú variado con boneless y sushi.', 25.5299, -103.3950, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/bonxi_q0nr91', 'gastronomia, boneless, sushi, comida casual');

INSERT INTO lugares (
  lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags
) VALUES
('Dulce’s Bakery', 'Desayunos, drinks, postres y más.', 25.54730000, -103.44790000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/bakerys_mwdzvz', 'gastronomia, desayuno, postres, bakery, cafe'),

('Santo Café', 'En Santo Café el espresso no se prepara con prisa, se prepara con cariño.', 25.54090000, -103.45180000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/santoC_tyizsy', 'gastronomia, cafe, espresso, desayuno, postres'),

('Pozole Don Beto y Gorditas Chelo', 'La especialidad es el pozole, jueves y viernes abiertos toda la madrugada.', 25.55800000, -103.41300000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/santoC_tyizsy', 'gastronomia, pozole, gorditas, comida mexicana, cena'),

('El Rayo Taquería', 'El mejor lugar de tacos estilo Sinaloa, está en Torreón.', 25.54220000, -103.45200000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/rayo_k3atip', 'gastronomia, tacos, taqueria, comida mexicana, cena');


INSERT INTO lugares (
  lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags
) VALUES
('VICENTE Asador de Brasa', 'Restaurante de carnes, disfruta de nuestra mixología en tu mesa. Cualquier día es buen día para brindar distinto.', 25.56200000, -103.40900000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/vicente_tqjkl1', 'night, cena, carnes, mixologia, bar'),

('Drums', 'Descubre Drumss en Torreón, el lugar ideal para disfrutar tus sábados en la noche. Haz tu reservación y vive la mejor fiesta.', 25.54180000, -103.44970000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/drums_cur03m', 'night, fiesta, musica, amigos, bar'),

('Punto Guerrero', 'Tu punto de encuentro. Food and drinks.', 25.60600000, -103.40400000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/guerrero_sugae1', 'night, food, drinks, amigos, convivencia'),

('La Chabela Food Park', 'En La Chabela Food Park encontrarás el ambiente perfecto para disfrutar de una tarde inolvidable con amigos.', 25.54170000, -103.45290000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/la_chabela_jrpnw3', 'night, food park, amigos, drinks, centro'),

('Yasuko', 'Bueno para ocasiones especiales e ideal para disfrutar cócteles creativos.', 25.56500000, -103.41000000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/yasuko_gseyov', 'night, cocteles, especial, cena, bar'),

('Madison', 'Bueno para ocasiones especiales e ideal para disfrutar cócteles creativos.', 25.54220000, -103.45060000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/yasuko_gseyov', 'night, cocteles, cena, especial, bar'),

('Sala de Despecho', 'Karaoke, tragos y los mejores rolones para cantar tus penas en Coahuila.', 25.56250000, -103.40850000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/ChatGPT_Image_4_may_2026_01_29_44_a.m._v8tsts', 'night, karaoke, tragos, musica, amigos'),

('Despecho', 'Cada noche en Despecho es una noche mágica. Ven y celebra tu cumpleaños, despedida, divorcio o simplemente tu soltería.', 25.54200000, -103.45320000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/ChatGPT_Image_4_may_2026_01_25_43_a.m._gcbgpd', 'night, musica, bar, fiesta, amigos');

INSERT INTO lugares (
  lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags
) VALUES
('Bosque Urbano', 'Parque familiar con atracciones, lleno de opciones para distraerse y un planetario.', 25.58000000, -103.40300000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/bosqueUrbano_eokuli', 'familiar, parque, planetario, naturaleza, niños'),

('Aviario Lira', 'Aquí vivirás una experiencia única rodeado de naturaleza.', 25.47800000, -103.39400000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/Aviario_esn6cu', 'familiar, naturaleza, aves, niños, animales'),

('Fly Jump', '¡Conócenos! Somos el parque más divertido de la Comarca.', 25.54000000, -103.40700000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/Fly_flxwdr', 'familiar, trampolines, juegos, niños, diversion'),

('Galex Game Center', 'Ven al lugar más divertido de la galaxia. Juegos y atracciones para toda la familia.', 25.56900000, -103.49500000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/galex_tgxovk', 'familiar, arcade, videojuegos, juegos, niños'),

('Pikabuu', 'Play. Connect. Repeat. Indoor playground for kids & grown-ups. Sala de juegos y cafetería.', 25.54100000, -103.40600000, 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/pikabuu_qs2jnz', 'familiar, playground, cafeteria, niños, indoor');

-- ==========================================
-- ASOCIAR NUEVOS LUGARES A RUTA GASTRONÓMICA
-- ==========================================

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta) VALUES
((SELECT lug_id FROM lugares WHERE lug_nombre = 'The Cookie Lab'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 4),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Tacos el Kampeon'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 5),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Rooster Wings'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 6),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'ZAO'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 7),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Grazie'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 8),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Casa Nalo'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 9),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Riviera'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 10),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Apapacho'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 11),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Sr Kimono'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 12),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Bonxi'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 13)
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta) VALUES
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Dulce’s Bakery'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 14),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Santo Café'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 15),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Pozole Don Beto y Gorditas Chelo'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 16),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'El Rayo Taquería'), (SELECT rut_id FROM rutas WHERE rut_nombre = 'Gastronomica'), 17)
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta) VALUES
((SELECT lug_id FROM lugares WHERE lug_nombre = 'VICENTE Asador de Brasa'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 5),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Drums'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 6),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Punto Guerrero'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 7),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'La Chabela Food Park'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 8),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Yasuko'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 9),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Madison'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 10),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Sala de Despecho'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 11),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Despecho'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Night'), 12)
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta) VALUES
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Bosque Urbano'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Familiar'), 5),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Aviario Lira'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Familiar'), 6),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Fly Jump'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Familiar'), 7),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Galex Game Center'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Familiar'), 8),
((SELECT lug_id FROM lugares WHERE lug_nombre = 'Pikabuu'), (SELECT rut_id FROM rutas WHERE rut_nombre ILIKE 'Familiar'), 9)
ON CONFLICT DO NOTHING;

SELECT lug_id, lug_nombre
FROM lugares
WHERE lug_nombre IN (
  'Bosque Urbano',
  'Aviario Lira',
  'Fly Jump',
  'Galex Game Center',
  'Pikabuu'
);

--Tablas para actividades del sprint 7

--transportes
CREATE TABLE transportes_publicos (
    tp_id SERIAL PRIMARY KEY,
    tp_nombre VARCHAR(100) NOT NULL,
    tp_tipo VARCHAR(50),
    tp_color VARCHAR(20),
    tp_descripcion TEXT
);

--Relación con lugares turísticos
CREATE TABLE transportes_lugares (
    tp_id INT NOT NULL,
    lug_id INT NOT NULL,
    PRIMARY KEY (tp_id, lug_id),
    FOREIGN KEY (tp_id) REFERENCES transportes_publicos(tp_id) ON DELETE CASCADE,
    FOREIGN KEY (lug_id) REFERENCES lugares(lug_id) ON DELETE CASCADE
);


Se insertan valores que son las rutas mas conocidas de Torreón y que pasan por las rutas que tenemos 


INSERT INTO transportes_publicos (tp_nombre, tp_tipo, tp_color, tp_descripcion) VALUES
('Polvorera', 'Camión urbano', '#A0522D', 'Cubre la colonia Polvorera, baja al centro, pasa por La Moderna y El Arenal.'),
('Primero de Mayo', 'Camión urbano', '#1E88E5', 'Cubre la colonia Primero de Mayo y colonias cercanas al Cerro de las Noas.'),
('Metalúrgica', 'Camión urbano', '#6D4C41', 'Pasa por Vicente Guerrero, Metalúrgica y va por bulevar Revolución hacia Mercado Alianza.'),
('Panteones', 'Camión urbano', '#8E24AA', 'Cubre Vicente Guerrero, Braulio Fernández, Lázaro Cárdenas, Laguna, La Dalia y Ex Hacienda La Perla.'),
('Sur Jardines', 'Camión urbano', '#43A047', 'Cubre Jardines de California, La Merced, Manhattan, John Deere, Parque Industrial Mieleras y Ex Hacienda La Perla.'),
('San Joaquín', 'Camión urbano', '#F4511E', 'Pasa por San Joaquín, Presidente Carranza, Villa California, Ciudad Nazas, Sol de Oriente, Rincón La Joya y Santa Fe.'),
('Dorada', 'Camión urbano', '#FDD835', 'Cubre El Águila, Latinoamericana, Residencial del Norte, Escuela Normal y rumbo al centro.'),
('Valle Oriente Azul', 'Camión urbano', '#3949AB', 'Cruza Valle Oriente hacia Monte Real y Rincón del Monte.'),
('Valle Oriente Rojo', 'Camión urbano', '#E53935', 'Va por Revolución, entra a Valle Oriente, Las Flores, Latinoamericana, Cereso, Jardines Universidad y Monte Real.'),
('La Joya', 'Camión urbano', '#00897B', 'Cubre ejido La Joya, parte de Sol de Oriente y bulevar Revolución hacia el centro.'),
('Norte', 'Camión urbano', '#5E35B1', 'Cubre Nueva California, Villa California, Ciudad Nazas, Las Aves y termina en La Joya y La Joyita.'),
('Alianza La Cortina', 'Camión urbano', '#7CB342', 'Cubre La Cortina, Valle Revolución, Valle Verde, La Mina, periférico y Fidel Velázquez hacia el centro.'),
('Allende-Abastos-La Cortina', 'Camión urbano', '#FB8C00', 'Parte de La Joyita, cubre La Cortina, Valle Verde, San Antonio de los Bravos, Satélite y clínica 66.'),
('Independencia-Narro', 'Camión urbano', '#00ACC1', 'Recorrido similar a Allende-Abastos-La Cortina, entrando a Magdalenas, Abastos, Independencia y centro.'),
('Alianza-Satélite', 'Camión urbano', '#C0CA33', 'Va al centro, entra a Satélite y recorre San Agustín, Veredas La Paz y zonas cercanas.'),
('Jacarandas', 'Camión urbano', '#D81B60', 'Cubre Jacarandas, Alamedas, El Roble, Villa Florida, Nueva Laguna, Ciudad Industrial y Villas San Agustín.'),
('Independencia-Magdalenas', 'Camión urbano', '#039BE5', 'Entra a Magdalenas, Pancho Villa, Bocanegra y Harinera.'),
('Triángulo Amarillo', 'Camión urbano', '#F9A825', 'Cubre Jacarandas, El Fresno, Independencia, Nudo Mixteco, El Arenal y La Moderna.'),
('Triángulo Rojo', 'Camión urbano', '#C62828', 'Cubre Felipe Ángeles, Diagonal Reforma, Nueva California, Abastos, Magdalenas, Escuela Normal, Rosita y La Fuente.'),
('Conchita Roja', 'Camión urbano', '#AD1457', 'Cubre La Conchita, ejido La Concha, TSM y carretera Torreón-San Pedro hacia el centro.'),
('Campo Alianza', 'Camión urbano', '#455A64', 'Ruta urbana que conecta Campo Alianza con el centro y varios puntos turísticos.'),
('Santa Fe', 'Camión urbano', '#2E7D32', 'Ruta urbana que conecta Santa Fe con el centro y zonas turísticas.'),
('Ciudad Nazas', 'Camión urbano', '#00838F', 'Ruta urbana que conecta Ciudad Nazas con diversos sectores de la ciudad.'),
('Solima', 'Intermunicipal', '#6A1B9A', 'Ruta intermunicipal que cubre zonas periféricas y conexión con puntos turísticos.'),
('Matamoros', 'Intermunicipal', '#283593', 'Ruta intermunicipal Torreón-Matamoros.'),
('Chavez', 'Camión urbano', '#4E342E', 'Ruta urbana que conecta varios sectores hacia el centro.'),
('Los Laureles', 'Camión urbano', '#558B2F', 'Ruta urbana que cubre Laureles y zonas cercanas.'),
('Independencia-Aeropuerto', 'Camión urbano', '#0277BD', 'Ruta urbana sobre Independencia hacia zona aeropuerto.'),
('Independencia-Antonio Narro', 'Camión urbano', '#26A69A', 'Ruta urbana por Independencia y Antonio Narro.'),
('San Agustín', 'Camión urbano', '#9CCC65', 'Ruta urbana que conecta San Agustín y el centro.'),
('Teleférico Torreón', 'Teleférico', '#00BCD4', 'Sistema aéreo que conecta el centro con el Cristo de las Noas.');


-- ==========================================
-- TRANSPORTES PARA NUEVOS LUGARES GASTRONÓMICOS
-- ==========================================

INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Dorada'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'The Cookie Lab')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Polvorera'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'The Cookie Lab')),

((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Campo Alianza'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Tacos el Kampeon')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Santa Fe'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Tacos el Kampeon')),

((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Campo Alianza'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Rooster Wings')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Santa Fe'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Rooster Wings')),

((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Campo Alianza'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'ZAO')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Jacarandas'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'ZAO')),

((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Dorada'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Grazie')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Independencia-Antonio Narro'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Grazie')),

((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Campo Alianza'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Casa Nalo')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Jacarandas'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Casa Nalo')),

((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Valle Oriente Rojo'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Riviera')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Ciudad Nazas'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Riviera')),

((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Campo Alianza'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Apapacho')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Jacarandas'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Apapacho')),

((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Dorada'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Sr Kimono')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Independencia-Antonio Narro'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Sr Kimono')),

((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Valle Oriente Rojo'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Bonxi')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Ciudad Nazas'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Bonxi'))
ON CONFLICT DO NOTHING;
--asociar lugares con transportes

--RUTA GASTRONOMICA

--Meercado Juarez -
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Mercado Juárez')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Mercado Juárez'))
 ON CONFLICT DO NOTHING;

--Distrito colon -
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Sur Jardines'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Distrito Colón'))
 ON CONFLICT DO NOTHING;

--La morelos -
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Polvorera'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'La Morelos'))
 ON CONFLICT DO NOTHING;

--RUTA CULTURAL
--Museo Arocena ---
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Arocena')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Arocena')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Allende-Abastos-La Cortina'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Arocena'))
 ON CONFLICT DO NOTHING;

--Teatro Isauro Martinez ---
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Santa Fe'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Teatro Isauro Martínez')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Norte'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Teatro Isauro Martínez'))
 ON CONFLICT DO NOTHING;

--Museo del Ferrocarril ---
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Ciudad Nazas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo del Ferrocarril')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'La Joya'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo del Ferrocarril')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Alianza La Cortina'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo del Ferrocarril')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Solima'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo del Ferrocarril')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Matamoros'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo del Ferrocarril')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Chavez'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo del Ferrocarril'))
 ON CONFLICT DO NOTHING;


--Paseo del canal de la  Perla ---
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Polvorera'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Paseo del Canal de la Perla')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Paseo del Canal de la Perla'))
 ON CONFLICT DO NOTHING;

--RUTA ENTRETENIMIENTO
--Planetarium Torreon ---
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Alianza La Cortina'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Planetarium Torreón')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Independencia-Antonio Narro'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Planetarium Torreón')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Independencia-Aeropuerto'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Planetarium Torreón')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Metalúrgica'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Planetarium Torreón')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Los Laureles'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Planetarium Torreón')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Santa Fe'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Planetarium Torreón'))
 ON CONFLICT DO NOTHING;




-- Cinemex Plaza cuatro caminos --
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Independencia-Magdalenas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Cinemex Platino Cuatro Caminos')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Valle Oriente Rojo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Cinemex Platino Cuatro Caminos')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Solima'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Cinemex Platino Cuatro Caminos')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Chavez'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Cinemex Platino Cuatro Caminos'))
 ON CONFLICT DO NOTHING;


-- Jardin de cerveza  (TSM) --
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Triángulo Rojo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Jardin de Cerveza (TSM)')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Jardin de Cerveza (TSM)')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Conchita Roja'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Jardin de Cerveza (TSM)'))
 ON CONFLICT DO NOTHING;
 

--Paseo Milex -
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Conchita Roja'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Paseo Milex'))
 ON CONFLICT DO NOTHING;

--RUTA NIGHT
--Plaza mayor-
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Santa Fe'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Plaza Mayor')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Norte'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Plaza Mayor')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'San Agustín'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Plaza Mayor'))
 ON CONFLICT DO NOTHING;

--Alameda Zaragoza -
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
 ((SELECT tp_id FROM transportes_publicos WHERE tp_nombre= 'Allende-Abastos-La Cortina'),
  (SELECT lug_id FROM lugares WHERE lug_nombre='Alameda Zaragoza')),
  ((SELECT tp_id FROM transportes_publicos WHERE tp_nombre='Jacarandas'),
  (SELECT lug_id FROM lugares WHERE lug_nombre= 'Alameda Zaragoza'))
  ON CONFLICT DO NOTHING;

--Plaza Cuatro caminos
  INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Independencia-Magdalenas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Plaza Cuatro Caminos')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Valle Oriente Rojo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Plaza Cuatro Caminos')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Solima'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Plaza Cuatro Caminos')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Chavez'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Plaza Cuatro Caminos'))
 ON CONFLICT DO NOTHING;

 -- Estadio coronona  (TSM) -
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Triángulo Rojo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Estadio Corona (TSM)')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Estadio Corona (TSM)')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Conchita Roja'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Estadio Corona (TSM)'))
 ON CONFLICT DO NOTHING;

--RUTA FAMILIAR
--Bosque venustiano Carranza - --
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Triángulo Rojo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Bosque Venustiano Carranza')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Bosque Venustiano Carranza'))
 ON CONFLICT DO NOTHING;
 
 --Teleferico torreon
 INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Primero de Mayo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Teleférico Torreón')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Teleférico Torreón'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Teleférico Torreón'))
 ON CONFLICT DO NOTHING;

 --Cristo de las Noas---
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Primero de Mayo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Cristo de las Noas')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Teleférico Torreón'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Cristo de las Noas'))
 ON CONFLICT DO NOTHING;

 --Puerto Noas
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Primero de Mayo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Puerto Noas')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Teleférico Torreón'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Puerto Noas'))
 ON CONFLICT DO NOTHING;

INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
-- Dulce’s Bakery
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Polvorera'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Dulce’s Bakery')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Jacarandas'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Dulce’s Bakery')),

-- Santo Café
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Campo Alianza'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Santo Café')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Santa Fe'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Santo Café')),

-- Pozole Don Beto y Gorditas Chelo
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Ciudad Nazas'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Pozole Don Beto y Gorditas Chelo')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Valle Oriente Rojo'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Pozole Don Beto y Gorditas Chelo')),

-- El Rayo Taquería
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Campo Alianza'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'El Rayo Taquería')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Santa Fe'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'El Rayo Taquería'))
ON CONFLICT DO NOTHING;

INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
-- VICENTE Asador de Brasa
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Dorada'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'VICENTE Asador de Brasa')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Independencia-Antonio Narro'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'VICENTE Asador de Brasa')),

-- Drums
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Campo Alianza'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Drums')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Santa Fe'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Drums')),

-- Punto Guerrero
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Norte'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Punto Guerrero')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Dorada'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Punto Guerrero')),

-- La Chabela Food Park
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Campo Alianza'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'La Chabela Food Park')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Polvorera'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'La Chabela Food Park')),

-- Yasuko
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Dorada'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Yasuko')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Independencia-Antonio Narro'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Yasuko')),

-- Madison
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Campo Alianza'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Madison')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Santa Fe'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Madison')),

-- Sala de Despecho
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Dorada'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Sala de Despecho')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Independencia-Antonio Narro'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Sala de Despecho')),

-- Despecho
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Campo Alianza'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Despecho')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Santa Fe'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Despecho'))
ON CONFLICT DO NOTHING;


INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
-- Bosque Urbano
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Independencia-Antonio Narro'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Bosque Urbano')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Dorada'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Bosque Urbano')),

-- Aviario Lira
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Sur Jardines'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Aviario Lira')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Panteones'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Aviario Lira')),

-- Fly Jump
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'San Joaquín'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Fly Jump')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Santa Fe'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Fly Jump')),

-- Galex Game Center
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'La Joya'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Galex Game Center')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Valle Oriente Rojo'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Galex Game Center')),

-- Pikabuu
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'San Joaquín'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Pikabuu')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre ILIKE 'Santa Fe'), (SELECT lug_id FROM lugares WHERE lug_nombre = 'Pikabuu'))
ON CONFLICT DO NOTHING;


SELECT * FROM transportes_lugares;
SELECT 
  tl.tp_id,
  t.tp_nombre,
  tl.lug_id,
  l.lug_nombre
FROM transportes_lugares tl
JOIN transportes_publicos t ON tl.tp_id = t.tp_id
JOIN lugares l ON tl.lug_id = l.lug_id
ORDER BY l.lug_nombre, t.tp_nombre;

SELECT * FROM transportes_lugares WHERE lug_id = 9;
SELECT * FROM transportes_publicos WHERE tp_id IN (19,21);


 SELECT 
  t.tp_id,
  t.tp_nombre,
  t.tp_tipo,
  t.tp_color,
  t.tp_descripcion
FROM transportes_lugares tl
JOIN transportes_publicos t ON tl.tp_id = t.tp_id
WHERE tl.lug_id = 9
ORDER BY t.tp_nombre ASC;




-- ==========================================
-- 7. FAVORITOS (M:N)
-- ==========================================
CREATE TABLE favoritos (
    usu_id INTEGER NOT NULL,
    lug_id INTEGER NOT NULL,

    PRIMARY KEY (usu_id, lug_id),

    FOREIGN KEY (usu_id) 
    REFERENCES usuarios(id) 
    ON DELETE CASCADE,

    FOREIGN KEY (lug_id) 
    REFERENCES lugares(lug_id) 
    ON DELETE CASCADE
);

select * from favoritos;
 
 ---Guardar Colores 

 SELECT rut_nombre, rut_color FROM rutas;

UPDATE rutas SET rut_color = '#FFF3EE' WHERE rut_nombre ILIKE 'Gastronomica';
UPDATE rutas SET rut_color = '#7a2cbf23' WHERE rut_nombre ILIKE 'Cultura';
UPDATE rutas SET rut_color = '#ffc4003c' WHERE rut_nombre ILIKE 'Entretenimiento';
UPDATE rutas SET rut_color = '#00b4d834' WHERE rut_nombre ILIKE 'Night';
UPDATE rutas SET rut_color = '#38b00059' WHERE rut_nombre ILIKE 'Familiar';

ALTER TABLE rutas
ALTER COLUMN rut_color TYPE VARCHAR(18);

--verificar

SELECT 
  l.lug_nombre,
  r.rut_nombre,
  lr.orden_en_ruta,
  l.imagen_principal_url
FROM lugares_rutas lr
JOIN lugares l ON lr.lug_id = l.lug_id
JOIN rutas r ON lr.rut_id = r.rut_id
WHERE r.rut_nombre = 'Gastronomica'
ORDER BY lr.orden_en_ruta;

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/beto_w4gqcz'
WHERE lug_nombre = 'Pozole Don Beto y Gorditas Chelo';
SELECT 
  l.lug_nombre,
  t.tp_nombre
FROM transportes_lugares tl
JOIN lugares l ON tl.lug_id = l.lug_id
JOIN transportes_publicos t ON tl.tp_id = t.tp_id
WHERE l.lug_nombre IN (
  'The Cookie Lab',
  'Tacos el Kampeon',
  'Rooster Wings',
  'ZAO',
  'Grazie',
  'Casa Nalo',
  'Riviera',
  'Apapacho',
  'Sr Kimono',
  'Bonxi'
)
ORDER BY l.lug_nombre, t.tp_nombre;

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/drjcuomng/image/upload/f_auto,q_auto/madbien_vtlr5q'
WHERE lug_nombre = 'Madison';
