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

------------------------------------------------------------------------
-- NUEVOS LUGARES RUTA ENTRETENIMIENTO
INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Casa Sigart',
'Aprende cerámica desde cero en Torreón. Nosotros te guiamos paso a paso.',
25.56229990, -103.43933070,
'https://casasigart.com/wp-content/uploads/2025/01/recoleccion.png',
'entretenimiento, manualidades, cafeteria, relajante'
WHERE NOT EXISTS (
    SELECT 1 FROM lugares WHERE lug_nombre = 'Casa Sigart'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Placard',
'Espacio de talleres creativos para niños y adultos con un enfoque de arte para todos.',
25.54202000, -103.45395000,
'https://maps.app.goo.gl/x3wdjZLPEVvrqZ6v7',
'entretenimiento, familiar, manualidades, divertido'
WHERE NOT EXISTS (
    SELECT 1 FROM lugares WHERE lug_nombre = 'Placard'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Panal TRC',
'Talleres de arte y manualidades para realizar durante la semana o el fin de semana. Para jovenes y adultos.',
25.54085000, -103.45090000,
'https://aspertxu.com/images/IMG-20210327-WA0002.jpg',
'entretenimiento, creatividad, jovenes, adultos'
WHERE NOT EXISTS (
    SELECT 1 FROM lugares WHERE lug_nombre = 'Panal TRC'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Espacio Creativo x MM Ceramica',
'Un estudio enfocado en la comunidad creativa que ofrece talleres de ceramica, escultura y dibujo, ideales para materializar ideas en un ambiente de convivencia.',
25.53713010, -103.42770990,
NULL,
'entretenimiento, creativo, adultos, manualidades'
WHERE NOT EXISTS (
    SELECT 1 FROM lugares WHERE lug_nombre = 'Espacio Creativo x MM Ceramica'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Colorea - Taller de Pintura',
'Ofrecen una experiencia de pintura decorativa donde puedes experimentar con acrilico, acuarela, oleo, hoja de oro y texturas.',
25.59590000, -103.40980000,
'https://maps.app.goo.gl/Jg9U4zZU2gCoQmEAA',
'entretenimiento, pintura, familiar, divertido'
WHERE NOT EXISTS (
    SELECT 1 FROM lugares WHERE lug_nombre = 'Colorea - Taller de Pintura'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Colores - Clases de Pintura en Torreon',
'Clases de pintura para bebes, niños, jovenes y adultos.',
25.53390000, -103.41750000,
'https://maps.app.goo.gl/RBVdPMqpNCohoGCR9',
'entretenimiento, pintura, familiar, creativo'
WHERE NOT EXISTS (
    SELECT 1 FROM lugares WHERE lug_nombre = 'Colores - Clases de Pintura en Torreon'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Casa de Arte Lila',
'Ofrece clases de pintura para adultos enfocadas en perder el miedo a tecnicas tradicionales como oleo o acuarela.',
25.52298730, -103.40244970,
'https://maps.app.goo.gl/P69XQJQMBjTpKF16A',
'entretenimiento, pintura, adultos, acuarelas'
WHERE NOT EXISTS (
    SELECT 1 FROM lugares WHERE lug_nombre = 'Casa de Arte Lila'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Kanvaa',
'Organizan eventos de Drink and Draw en diferentes sedes de la ciudad, uniendo el dibujo con un ambiente relajado de bar o cafeteria.',
25.56260000, -103.41080000,
'https://maps.app.goo.gl/PQeBbVngyfeXAkbY7',
'entretenimiento, dibujo, adultos, bebidas'
WHERE NOT EXISTS (
    SELECT 1 FROM lugares WHERE lug_nombre = 'Kanvaa'
);


-- ASOCIARLOS A RUTA ENTRETENIMIENTO
INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 5
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Casa Sigart'
AND r.rut_nombre = 'Entretenimiento'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 6
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Placard'
AND r.rut_nombre = 'Entretenimiento'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 7
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Panal TRC'
AND r.rut_nombre = 'Entretenimiento'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 8
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Espacio Creativo x MM Ceramica'
AND r.rut_nombre = 'Entretenimiento'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 9
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Colorea - Taller de Pintura'
AND r.rut_nombre = 'Entretenimiento'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 10
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Colores - Clases de Pintura en Torreon'
AND r.rut_nombre = 'Entretenimiento'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 11
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Casa de Arte Lila'
AND r.rut_nombre = 'Entretenimiento'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 12
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Kanvaa'
AND r.rut_nombre = 'Entretenimiento'
ON CONFLICT DO NOTHING;


--PARA VERIFICAR QUE SE AGREGARON (OPC)
SELECT 
    l.lug_id,
    l.lug_nombre,
    r.rut_nombre,
    lr.orden_en_ruta
FROM lugares_rutas lr
JOIN lugares l ON lr.lug_id = l.lug_id
JOIN rutas r ON lr.rut_id = r.rut_id
WHERE r.rut_nombre = 'Entretenimiento'
ORDER BY lr.orden_en_ruta;

--ASOCIAR EL TRANSPORTE A LOS NUEVOS LUGARES

-- Casa Sigart
-- Zona Nueva Los Ángeles / cerca de Independencia
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Independencia-Aeropuerto'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Casa Sigart')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Dorada'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Casa Sigart')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Casa Sigart'))
ON CONFLICT DO NOTHING;


-- Placard
-- Zona Centro / Matamoros
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Placard')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Placard')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Polvorera'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Placard'))
ON CONFLICT DO NOTHING;


-- Panal TRC
-- Zona Centro / Morelos
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Panal TRC')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Panal TRC')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Polvorera'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Panal TRC'))
ON CONFLICT DO NOTHING;


-- Espacio Creativo x MM Ceramica
-- Zona Oriente / Hidalgo
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Santa Fe'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Espacio Creativo x MM Ceramica')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'San Joaquín'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Espacio Creativo x MM Ceramica')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Norte'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Espacio Creativo x MM Ceramica'))
ON CONFLICT DO NOTHING;


-- Colorea - Taller de Pintura
-- Zona Senderos
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Independencia-Aeropuerto'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Colorea - Taller de Pintura')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Colorea - Taller de Pintura')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Los Laureles'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Colorea - Taller de Pintura'))
ON CONFLICT DO NOTHING;


-- Colores - Clases de Pintura en Torreon
-- Zona Torreón Jardín
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Triángulo Rojo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Colores - Clases de Pintura en Torreon')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Sur Jardines'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Colores - Clases de Pintura en Torreon')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Valle Oriente Rojo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Colores - Clases de Pintura en Torreon'))
ON CONFLICT DO NOTHING;


-- Casa de Arte Lila
-- Zona Torreón Residencial / Gómez Morin
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Sur Jardines'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Casa de Arte Lila')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Valle Oriente Rojo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Casa de Arte Lila')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'San Joaquín'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Casa de Arte Lila'))
ON CONFLICT DO NOTHING;


-- Kanvaa
-- Zona Blvd. Independencia / El Fresno
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Independencia-Aeropuerto'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Kanvaa')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Independencia-Magdalenas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Kanvaa')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Kanvaa'))
ON CONFLICT DO NOTHING;



--PARA VERIFICAR QUE SI SE ASOCIARON LOS TRANSPORTES (OPC)
SELECT 
  l.lug_nombre,
  t.tp_nombre,
  t.tp_tipo,
  t.tp_color
FROM transportes_lugares tl
JOIN lugares l ON tl.lug_id = l.lug_id
JOIN transportes_publicos t ON tl.tp_id = t.tp_id
WHERE l.lug_nombre IN (
  'Casa Sigart',
  'Placard',
  'Panal TRC',
  'Espacio Creativo x MM Ceramica',
  'Colorea - Taller de Pintura',
  'Colores - Clases de Pintura en Torreon',
  'Casa de Arte Lila',
  'Kanvaa'
)
ORDER BY l.lug_nombre, t.tp_nombre;

--PARA VERIFICAR QUE SI SE MANDAN ALEATORIAMENTE 5 LUGARES (OPC)
SELECT 
  l.lug_nombre
FROM lugares l
JOIN lugares_rutas lr ON l.lug_id = lr.lug_id
JOIN rutas r ON lr.rut_id = r.rut_id
WHERE r.rut_nombre ILIKE 'Entretenimiento'
ORDER BY RANDOM()
LIMIT 5;

--Actualizacion de imagenes para los nuevos lugares
UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/f_auto,q_auto/Captura_de_pantalla_2026-05-01_222823_ikqct3'
WHERE lug_nombre = 'Casa Sigart';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777696732/Captura_de_pantalla_2026-05-01_223802_atxfyv.png'
WHERE lug_nombre = 'Placard';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777697113/Captura_de_pantalla_2026-05-01_224438_hymfjp.png'
WHERE lug_nombre = 'Espacio Creativo x MM Ceramica';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777697270/Captura_de_pantalla_2026-05-01_224621_e03cdj.png'
WHERE lug_nombre = 'Colorea - Taller de Pintura';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777697345/Captura_de_pantalla_2026-05-01_224836_avzxju.png'
WHERE lug_nombre = 'Colores - Clases de Pintura en Torreon';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777697462/Captura_de_pantalla_2026-05-01_225050_a2kzqq.png'
WHERE lug_nombre = 'Casa de Arte Lila';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777697634/Captura_de_pantalla_2026-05-01_225340_koq8mq.png'
WHERE lug_nombre = 'Kanvaa';

------------------------------------------------------------------------
-- NUEVOS LUGARES RUTA CULTURAL
INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Museo Casa del Cerro',
'Historia de la ciudad en una edificacion singular.',
25.53590000, -103.46290000,
NULL,
'cultural, museo, historia, adultos'
WHERE NOT EXISTS (
  SELECT 1 FROM lugares WHERE lug_nombre = 'Museo Casa del Cerro'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Museo Regional de la Laguna',
'Arqueologia y etnografia de la region.',
25.54550000, -103.43820000,
NULL,
'cultural, historia, museo, familiar'
WHERE NOT EXISTS (
  SELECT 1 FROM lugares WHERE lug_nombre = 'Museo Regional de la Laguna'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Museo de la Revolucion',
'Enfocado en la historia de la Revolucion Mexicana.',
25.54190000, -103.44430000,
NULL,
'cultural, revolucion, museo, historia'
WHERE NOT EXISTS (
  SELECT 1 FROM lugares WHERE lug_nombre = 'Museo de la Revolucion'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Museo de los Metales',
'Enfocado en la mineria y metalurgia.',
25.52313971, -103.44647529,
NULL,
'cultural, museo, mineria, historia'
WHERE NOT EXISTS (
  SELECT 1 FROM lugares WHERE lug_nombre = 'Museo de los Metales'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Centro Cultural Casa Mudejar',
'Espacio de exposiciones y eventos artisticos.',
25.54220000, -103.45400000,
NULL,
'cultural, exposiciones, arte, familiar'
WHERE NOT EXISTS (
  SELECT 1 FROM lugares WHERE lug_nombre = 'Centro Cultural Casa Mudejar'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Centro Cultural Antigua Harinera',
'Espacio dedicado a diversas disciplinas artisticas.',
25.53890000, -103.45990000,
NULL,
'cultural, arte, familiar, historia'
WHERE NOT EXISTS (
  SELECT 1 FROM lugares WHERE lug_nombre = 'Centro Cultural Antigua Harinera'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Museo de La Moneda',
'Recinto cultural ubicado en la boveda del antiguo Banco de Mexico.',
25.54090000, -103.44980000,
NULL,
'cultural, moneda, historia, adultos'
WHERE NOT EXISTS (
  SELECT 1 FROM lugares WHERE lug_nombre = 'Museo de La Moneda'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Museo del Algodon',
'Expone la historia industrial de nuestra region.',
25.54200000, -103.45480000,
NULL,
'cultural, industrial, adultos, regional'
WHERE NOT EXISTS (
  SELECT 1 FROM lugares WHERE lug_nombre = 'Museo del Algodon'
);

INSERT INTO lugares 
(lug_nombre, lug_descripcion, lug_latitud, lug_longitud, imagen_principal_url, lug_tags)
SELECT 'Museo Paleontologico de la Laguna',
'Enfocado en exhibicion de especimenes y fosiles de animales.',
25.54240000, -103.45390000,
NULL,
'cultural, museo, fosiles, familiar'
WHERE NOT EXISTS (
  SELECT 1 FROM lugares WHERE lug_nombre = 'Museo Paleontologico de la Laguna'
);


-- ASOCIAR A RUTA CULTURA
INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 5
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Museo Casa del Cerro'
AND r.rut_nombre = 'Cultura'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 6
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Museo Regional de la Laguna'
AND r.rut_nombre = 'Cultura'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 7
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Museo de la Revolucion'
AND r.rut_nombre = 'Cultura'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 8
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Museo de los Metales'
AND r.rut_nombre = 'Cultura'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 9
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Centro Cultural Casa Mudejar'
AND r.rut_nombre = 'Cultura'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 10
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Centro Cultural Antigua Harinera'
AND r.rut_nombre = 'Cultura'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 11
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Museo de La Moneda'
AND r.rut_nombre = 'Cultura'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 12
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Museo del Algodon'
AND r.rut_nombre = 'Cultura'
ON CONFLICT DO NOTHING;

INSERT INTO lugares_rutas (lug_id, rut_id, orden_en_ruta)
SELECT l.lug_id, r.rut_id, 13
FROM lugares l, rutas r
WHERE l.lug_nombre = 'Museo Paleontologico de la Laguna'
AND r.rut_nombre = 'Cultura'
ON CONFLICT DO NOTHING;

--CONSULTA PARA VERIFICAR SI SE AGREGARON (opc)
SELECT 
  l.lug_id,
  l.lug_nombre,
  r.rut_nombre,
  lr.orden_en_ruta,
  l.imagen_principal_url
FROM lugares_rutas lr
JOIN lugares l ON lr.lug_id = l.lug_id
JOIN rutas r ON lr.rut_id = r.rut_id
WHERE r.rut_nombre = 'Cultura'
ORDER BY lr.orden_en_ruta;


-- TRANSPORTES PARA NUEVOS LUGARES CULTURALES
-- Museo Casa del Cerro
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Primero de Mayo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Casa del Cerro')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Polvorera'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Casa del Cerro')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Casa del Cerro'))
ON CONFLICT DO NOTHING;


-- Museo Regional de la Laguna
-- Está dentro/zona Bosque Venustiano Carranza
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Triángulo Rojo'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Regional de la Laguna')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Regional de la Laguna')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Independencia-Aeropuerto'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Regional de la Laguna'))
ON CONFLICT DO NOTHING;


-- Museo de la Revolucion
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Polvorera'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo de la Revolucion')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo de la Revolucion')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo de la Revolucion'))
ON CONFLICT DO NOTHING;


-- Museo de los Metales
-- Zona Metalúrgica
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Metalúrgica'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo de los Metales')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Panteones'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo de los Metales')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Sur Jardines'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo de los Metales'))
ON CONFLICT DO NOTHING;


-- Centro Cultural Casa Mudejar
-- Zona Centro
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Centro Cultural Casa Mudejar')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Centro Cultural Casa Mudejar')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Polvorera'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Centro Cultural Casa Mudejar'))
ON CONFLICT DO NOTHING;


-- Centro Cultural Antigua Harinera
-- Zona Centro / Blvd Revolución
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Centro Cultural Antigua Harinera')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Polvorera'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Centro Cultural Antigua Harinera')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Metalúrgica'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Centro Cultural Antigua Harinera'))
ON CONFLICT DO NOTHING;


-- Museo de La Moneda
-- Zona Morelos / Centro
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo de La Moneda')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo de La Moneda')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Polvorera'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo de La Moneda'))
ON CONFLICT DO NOTHING;


-- Museo del Algodon
-- Zona Centro
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo del Algodon')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo del Algodon')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Polvorera'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo del Algodon'))
ON CONFLICT DO NOTHING;


-- Museo Paleontologico de la Laguna
-- Zona Centro / Av. Juárez
INSERT INTO transportes_lugares (tp_id, lug_id) VALUES
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Campo Alianza'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Paleontologico de la Laguna')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Jacarandas'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Paleontologico de la Laguna')),
((SELECT tp_id FROM transportes_publicos WHERE tp_nombre = 'Santa Fe'),
 (SELECT lug_id FROM lugares WHERE lug_nombre = 'Museo Paleontologico de la Laguna'))
ON CONFLICT DO NOTHING;


-- VERIFICAR QUE SE ASOCIARON EL TRANSPORTE
SELECT 
  l.lug_nombre,
  t.tp_nombre,
  t.tp_tipo,
  t.tp_color
FROM transportes_lugares tl
JOIN lugares l ON tl.lug_id = l.lug_id
JOIN transportes_publicos t ON tl.tp_id = t.tp_id
WHERE l.lug_nombre IN (
  'Museo Casa del Cerro',
  'Museo Regional de la Laguna',
  'Museo de la Revolucion',
  'Museo de los Metales',
  'Centro Cultural Casa Mudejar',
  'Centro Cultural Antigua Harinera',
  'Museo de La Moneda',
  'Museo del Algodon',
  'Museo Paleontologico de la Laguna'
)
ORDER BY l.lug_nombre, t.tp_nombre;

--IMAGENES ACTUALIZADAS DE NUEVOS LUGARES CULTURA
UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777701203/Captura_de_pantalla_2026-05-01_235259_uulaq3.png'
WHERE lug_nombre = 'Museo Casa del Cerro';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777701579/Captura_de_pantalla_2026-05-01_235916_jqmafc.png'
WHERE lug_nombre = 'Museo Regional de la Laguna';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777701671/Captura_de_pantalla_2026-05-02_000045_eacpft.png'
WHERE lug_nombre = 'Museo de la Revolucion';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777701736/Captura_de_pantalla_2026-05-02_000203_urkgqo.png'
WHERE lug_nombre = 'Museo de los Metales';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777701824/Captura_de_pantalla_2026-05-02_000334_ayvp54.png'
WHERE lug_nombre = 'Centro Cultural Casa Mudejar';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777701928/Captura_de_pantalla_2026-05-02_000513_gldamz.png'
WHERE lug_nombre = 'Centro Cultural Antigua Harinera';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777701991/Captura_de_pantalla_2026-05-02_000620_ehknou.png'
WHERE lug_nombre = 'Museo de La Moneda';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777702073/Captura_de_pantalla_2026-05-02_000741_j5iitc.png'
WHERE lug_nombre = 'Museo del Algodon';

UPDATE lugares
SET imagen_principal_url = 'https://res.cloudinary.com/dr3nbvham/image/upload/v1777702154/Captura_de_pantalla_2026-05-02_000904_ay5sp8.png'
WHERE lug_nombre = 'Museo Paleontologico de la Laguna';
