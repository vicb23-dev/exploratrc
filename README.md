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


