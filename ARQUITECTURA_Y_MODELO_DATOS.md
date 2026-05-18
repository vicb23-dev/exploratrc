EXPLORA_TRC -> DOCUMENTACIÓN ARQUITECTURA Y MODELO DE DATOS FINAL

---------------------INTRODUCCIÓN--------------------------------
Explora TRC es una aplicación móvil desarrollada con el objetivo de ayudar a los usuarios a descubrir lugares turísticos, culturales, gastronómicos, familiares night y de entretenimiento dentro de la región de Torreón.
El sistema permite visualizar lugares en un mapa interactivo, consultar rutas temáticas, guardar favoritos y
obtener recomendaciones mediante un chatbot inteligente.

El proyecto fue desarrollado utilizando una arquitectura cliente-servidor, permitiendo separar la lógica de la aplicación móvil, el procesamiento de datos y el almacenamiento de información.

----------------ARQUITECTURA DEL SISTEMA--------------------------
El sistema se encuentra dividido en tres componentes principales:

Frontend móvil.
Backend/API.
Base de datos PostgreSQL.

La comunicación entre estos componentes se realiza mediante solicitudes HTTP utilizando una API REST.

------------------------FRONTEND----------------------------------
El frontend fue desarrollado utilizando React Native con Expo Router y TypeScript.

La aplicación móvil es la encargada de:

Mostrar las interfaces al usuario.
Visualizar mapas interactivos.
Mostrar lugares turísticos.
Gestionar favoritos.
Consumir la API del backend.
Mostrar rutas y experiencias.
Interactuar con el chatbot.
Tecnologías utilizadas
React Native
Expo GO
TypeScript
Axios
Expo Router
Leaflet
OpenStreetMap

| Carpeta      | Función                                              |
| ------------ | ---------------------------------------------------- |
| "app"        | Contiene las pantallas principales de la aplicación. |
| "components" | Componentes reutilizables de la interfaz.            |
| "services"   | Configuración de conexión con la API.                |
| "assets"     | Imágenes y recursos visuales.                        |

------------------------BACKEND----------------------------------
El backend fue desarrollado utilizando Node.js y Express.
Su función principal es:

Procesar solicitudes.
Gestionar lógica del sistema.
Conectarse a la base de datos.
Enviar información al frontend.
Gestionar autenticación y favoritos.
Integrar APIs externas.
Tecnologías utilizadas
Node.js
Express
PostgreSQL
dotenv
cors
Funcionalidades principales
Inicio de sesión.
Registro de usuarios.
Consulta de lugares.
Gestión de favoritos.
Consulta de transportes.
Sistema de rutas temáticas.
Chatbot de recomendaciones.

------------------------BASE DE DATOS----------------------------
La base de datos fue desarrollada en PostgreSQL.
Su objetivo es almacenar toda la información utilizada dentro de la aplicación, incluyendo:

usuarios
lugares
rutas
favoritos
transportes
experiencias

------------------------APIs Y SERVICIOS EXTERNOS----------------
El sistema utiliza servicios externos para ampliar funcionalidades.

OpenStreetMap:
Utilizado para mostrar mapas interactivos dentro de la aplicación.

Leaflet:
Librería utilizada para visualizar mapas y marcadores.

OpenRouteService:
Utilizado para generar rutas e indicaciones entre ubicaciones.

Gemini IA:
Utilizado para el chatbot de recomendaciones inteligentes.

------------------------FLUJO GENERAL DEL SISTEMA----------------
El usuario interactúa con la aplicación móvil.
El frontend envía solicitudes HTTP al backend.
El backend procesa la solicitud.
Se realizan consultas a PostgreSQL.
El backend devuelve la información al frontend.
La aplicación muestra resultados al usuario.

------------------------ESTRUCTURA DEL PROYECTO------------------
exploratrc
│
├── .expo/
│ → archivos generados automáticamente por Expo
│
├── .vscode/
│ → configuración del entorno de Visual Studio Code
│
├── api-lugares/
│ ├── node_modules/ → dependencias del módulo
│ ├── package.json → configuración del módulo
│ └── package-lock.json → control de dependencias
│
├── app/
│ │
│ ├── (tabs)/
│ │ ├── src/ → archivos auxiliares internos
│ │ ├── \_layout.tsx → navegación principal mediante tabs
│ │ ├── chatbot.tsx → pantalla del chatbot inteligente
│ │ ├── detallesLugar.tsx → visualización detallada de lugares
│ │ ├── favoritos.tsx → lugares favoritos del usuario
│ │ ├── mapa.tsx → mapa interactivo principal
│ │ ├── navegacionRuta.tsx → navegación y visualización de rutas
│ │ ├── rutaCultura.tsx → ruta temática cultural
│ │ ├── rutaEntretenimiento.tsx → ruta temática entretenimiento
│ │ ├── rutaFamiliar.tsx → ruta temática familiar
│ │ ├── rutaGastronomica.tsx → ruta temática gastronómica
│ │ ├── rutaNight.tsx → ruta temática nocturna
│ │ └── rutas.tsx → listado general de rutas
│ │
│ ├── componentes/
│ │ → componentes reutilizables de la aplicación
│ │
│ ├── \_layout.tsx → configuración general de navegación
│ ├── forgotPassword.tsx → recuperación de contraseña
│ ├── index.tsx → pantalla inicial de bienvenida
│ ├── login.tsx → inicio de sesión
│ ├── register.tsx → registro de usuarios
│ ├── resetPassword.tsx → actualización de contraseña
| |── verRuta.tsx → actualización de datos de la ruta
│ |
│ ├── assets/images/
│ ├── logo.png → logotipo principal de la aplicación
│ ├── icon.png → ícono principal
│ ├── splash.png → pantalla de carga
│ |── marcadores/ → imágenes utilizadas en el mapa
│ └── fonts/
│ → tipografías utilizadas en la interfaz
|
├── backend/
| ├── controllers/
│ │ ├── userController.js → lógica de autenticación
│ │ ├── rutasController.js → gestión de lugares turísticos
│ │ ├── userController.js → gestión de usuarios
│ │ └── transportesController.js → gestión de transportes
│ │
│ │
│ ├── routes/
│ │ ├── chatbotController.js → procesamiento del chatbot
│ │ ├── detallesLugarRuta.js → rutas para detalles de lugares
│ │ ├── experienciasRoutes.js → rutas de experiencias temáticas
│ │ ├── favoritoRoutes.js → rutas para favoritos
│ │ ├── mapRoutes.js → rutas relacionadas con mapas
│ │ ├── rutas.js → rutas generales del sistema
│ │ ├── transporteRoutes.js → rutas de transportes
│ │ └── userRoutes.js → autenticación y usuarios
│ │
│ ├── .env → variables de entorno y claves API
│ ├── create_table_usuarios.sql → script de tabla usuarios
│ ├── package.json → configuración del backend
│ ├── package-lock.json → dependencias instaladas
│ └── server.js → servidor principal de Express
│
├── components/
│ ├── ui/ → componentes visuales reutilizables
│ ├── external-link.tsx → componente de enlaces externos
│ ├── haptic-tab.tsx → navegación con retroalimentación háptica
│ ├── hello-wave.tsx → componente animado
│ ├── MapWebView.tsx → integración del mapa mediante WebView
│ ├── parallax-scroll-view.tsx → scroll con efecto parallax
│ ├── themed-text.tsx → texto con temas dinámicos
│ └── themed-view.tsx → contenedores con soporte de temas
│
├── config/
│ └── keys.ts → almacenamiento de claves y configuraciones
│
├── constants/
│ ├── mapHtml.ts → configuración HTML del mapa Leaflet
│ └── theme.ts → colores y estilos globales de la app
│
├── hooks/
│ → hooks personalizados de React
│
├── node_modules/
│ → dependencias generales del proyecto
│
├── public/
│ ├── app.js → scripts públicos auxiliares
│ └── index.html → estructura HTML pública
│
├── scripts/
│ └── reset-project.js → reinicio/configuración del proyecto
│
├── services/
│ └── api.js → conexión principal con la API backend
│
├── .gitignore → archivos ignorados por Git
├── app.json → configuración principal de Expo
├── ARQUITECTURA_Y_MODELO_DATOS.md → documentación técnica del proyecto
├── CREATE TABLE usuarios.pgsql → script SQL de usuarios
├── eslint.config.js → configuración de ESLint
├── expo-env.d.ts → configuración de tipos Expo
├── package.json → dependencias generales del frontend
├── package-lock.json → control de versiones de dependencias
├── README.md → documentación principal del proyecto
└── tsconfig.json → configuración de TypeScript

------------------------MODELO DE DATOS FINAL--------------------
El modelo de datos implementado en Explora TRC fue desarrollado utilizando PostgreSQL con el propósito de administrar
la información turística, rutas temáticas, experiencias, usuarios, favoritos y transportes públicos de la aplicación.
La estructura fue diseñada para mantener relaciones entre entidades y permitir una navegación dinámica dentro del sistema.

****\*\*****\*\*\*****\*\*****TABLA DE USUARIOS****\*\*\*\*****\*****\*\*\*\*****

La tabla usuarios almacena la información de los usuarios registrados dentro de la aplicación. Permite gestionar el inicio de sesión, autenticación y personalización de contenido.

| Campo    | Tipo         | Descripción                     |
| -------- | ------------ | ------------------------------- |
| id       | SERIAL       | Identificador único del usuario |
| nombre   | VARCHAR(100) | Nombre del usuario              |
| email    | VARCHAR(100) | Correo electrónico único        |
| password | TEXT         | Contraseña del usuario          |
| rol      | VARCHAR(20)  | Rol asignado dentro del sistema |

****\*\*****\*\*\*****\*\*****TABLA DE RUTAS****\*\*\*\*****\*****\*\*\*\*****
La tabla rutas almacena las categorías o rutas temáticas del sistema turístico. Cada ruta contiene lugares relacionados con una temática específica.

| Campo           | Tipo        | Descripción                     |
| --------------- | ----------- | ------------------------------- |
| rut_id          | SERIAL      | Identificador único             |
| rut_nombre      | VARCHAR(50) | Nombre de la ruta               |
| rut_descripcion | TEXT        | Descripción general             |
| rut_color       | VARCHAR(18) | Color representativo de la ruta |

Rutas en las que fueron implementadas:
Gastronómica
Cultura
Night
Familiar
Entretenimiento

****\*\*****\*\*\*****\*\*****TABLA DE LUGARES****\*\*\*\*****\*****\*\*\*\*****
La tabla lugares contiene todos los sitios turísticos y recreativos utilizados dentro de la aplicación.

| Campo                | Tipo         | Descripción                                  |
| -------------------- | ------------ | -------------------------------------------- |
| lug_id               | SERIAL       | Identificador del lugar                      |
| lug_nombre           | VARCHAR(100) | Nombre del lugar                             |
| lug_descripcion      | TEXT         | Información descriptiva                      |
| lug_latitud          | DECIMAL      | Coordenada geográfica                        |
| lug_longitud         | DECIMAL      | Coordenada geográfica                        |
| imagen_principal_url | VARCHAR(255) | Imagen principal                             |
| lug_tags             | TEXT         | Etiquetas utilizadas para búsqueda y chatbot |

Categorías de lugares:
Cultura
Gastronomía
Familiar
Night
Entretenimiento

**\*\*\*\***\*\*\*\***\*\*\*\***TABLA DE LUGARES_RUTAS****\*\*****\*\*\*\*****\*\*****
La tabla lugares_rutas funciona como tabla intermedia para relacionar lugares con rutas temáticas.

Permite que:

una ruta tenga muchos lugares,
y un lugar pueda pertenecer a varias rutas.
Relaciones
FK lug_id -> lugares
FK rut_id -> rutas

****\*\*****\*\*\*****\*\*****TABLA DE EXPERIENCIAS_RUTAS****\*\*\*\*****\*****\*\*\*\*****
La tabla experiencias_rutas almacena experiencias completas dentro de cada ruta temática.

Agrupar lugares según un recorrido sugerido para el usuario.

Ejemplos
Día gastronómico clásico
Noche con amigos
Diversión extrema
Tarde infantil

****\*\*****\*\*\*****\*\*****TABLA DE EXPERIENCIAS_LUGARES****\*\*\*\*****\*****\*\*\*\*****
La tabla experiencias_lugares relaciona las experiencias con los lugares turísticos.

Permite organizar los lugares según:

momento del recorrido,
orden de visita,
experiencia seleccionada.
Relaciones
FK exp_id -> experiencias_rutas
FK lug_id -> lugares

****\*\*****\*\*\*****\*\*****TABLA DE TRANSPORTES_PUBLICOS****\*\*\*\*****\*****\*\*\*\*****
La tabla transportes_publicos almacena las rutas de transporte utilizadas dentro del sistema.

Mostrar opciones de movilidad cercanas a los lugares turísticos.

Tipos de transporte
Camión urbano
Intermunicipal
Teleférico

****\*\*****\*\*\*****\*\*****TABLA DE TRANSPORTES_LUGARES****\*\*\*\*****\*****\*\*\*\*****
La tabla transportes_lugares relaciona los lugares turísticos con las rutas de transporte disponibles.

Permitir que el usuario consulte qué transporte puede utilizar para llegar a un lugar.

Relaciones
FK tp_id -> transportes_publicos
FK lug_id -> lugares

****\*\*****\*\*\*****\*\*****TABLA DE FAVORITOS****\*\*\*\*****\*****\*\*\*\*****
La tabla favoritos almacena los lugares guardados por cada usuario dentro de la aplicación.

Personalizar la experiencia del usuario permitiendo guardar lugares favoritos.

Relaciones
FK usu_id → usuarios
FK lug_id → lugares

---------------------RELACIONES PRINCIPALES DEL SISTEMA-----------
usuarios
│
|└── favoritos
| │
| └── lugares

rutas
│
|── lugares_rutas
| │
| └── lugares

rutas
│
|── experiencias_rutas
| │
| └── experiencias_lugares
| │
| └── lugares

transportes_publicos
│
|── transportes_lugares
| │
| └── lugares

El sistema implementa relaciones de tipo:

Relación muchos a muchos (M:N)
lugares ↔ rutas
usuarios ↔ lugares (favoritos)
lugares ↔ transportes
Relación uno a muchos (1:N)
rutas → experiencias
experiencias → lugares asociados

---------------------FUNCIONALIDAD DEL MODELO DE DATOS------------
El modelo de datos permite:

organizar lugares turísticos por categorías
crear experiencias dinámicas
almacenar imágenes y coordenadas
relacionar transportes con lugares
gestionar favoritos
alimentar el chatbot mediante etiquetas (lug_tags)
generar recorridos personalizados

---------------------INTEGRACIÓN CON EL SISTEMA-------------------
La base de datos se conecta con el backend desarrollado en Node.js y Express mediante consultas SQL y endpoints REST.
La aplicación móvil consume esta información utilizando Axios y servicios API para mostrar contenido dinámico al usuario.

---------------------FUNCIONAMIENTO GENERAL-----------------------
El usuario interactúa con la aplicación móvil.
El frontend solicita información al backend.
El backend consulta PostgreSQL.
La base de datos devuelve lugares, rutas, experiencias y transportes.
La aplicación muestra la información mediante mapas y tarjetas interactivas.

---------------------OBJETIVO DEL MODELO DE DATOS-----------------
El modelo de datos fue diseñado para:

organizar información turística
gestionar rutas temáticas
mostrar experiencias dinámicas
almacenar favoritos
integrar transportes públicos
alimentar el chatbot inteligente
permitir una navegación interactiva dentro de la aplicación
