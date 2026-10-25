# Hoja de Vida - API REST con CRUD de Experiencias Profesionales

**Actividad Unidad 3 - CTEV Universidad de Cartagena**  
**Autor:** Jorge Enrique Meza Rocha  
**Programa:** Hoja de Vida Digital / Aplicaciones Web  

---

## 📌 Descripción del Proyecto

Este proyecto implementa una **API RESTful** completa que cumple con las operaciones **CRUD** (Crear, Leer, Actualizar y Eliminar) para gestionar la información de las **experiencias profesionales** de la hoja de vida personal de Jorge Meza.

El sistema fue desarrollado integrando:
- **Node.js**: Entorno de ejecución en el servidor.
- **Express.js**: Framework backend minimalista y flexible para la creación de endpoints y middlewares.
- **MongoDB**: Sistema de gestión de bases de datos NoSQL documental.
- **Mongoose**: Modelado de objetos para MongoDB (ODM) con validaciones y esquemas estructurados.
- **Swagger UI (OpenAPI 3.0)**: Documentación y pruebas interactivas de los endpoints directamente desde el navegador web.
- **Postman**: Colección de pruebas automatizadas y listas para importar (`HojaDeVida_Experiencias.postman_collection.json`).
- **Bootstrap 5 & JavaScript**: Frontend interactivo que consume la API REST de manera asíncrona (`fetch`).

---

## 📁 Estructura del Proyecto

```text
HojaDeVida_API/
├── src/
│   ├── config/
│   │   └── db.js                        # Conexión a MongoDB con Mongoose
│   ├── controllers/
│   │   └── experienciaController.js     # Lógica de las operaciones CRUD
│   ├── docs/
│   │   └── swaggerSpec.js               # Especificación OpenAPI 3.0 para Swagger
│   ├── models/
│   │   └── Experiencia.js               # Esquema de datos NoSQL (Mongoose)
│   └── routes/
│       └── experienciaRoutes.js         # Definición de rutas de la API
├── .env                                 # Variables de entorno (Puerto, URI de MongoDB)
├── .env.example                         # Plantilla de variables de entorno
├── HojaDeVida_Experiencias.postman_collection.json  # Colección lista para Postman
├── server.js                            # Servidor principal de Express
├── seed.js                              # Script de poblado inicial de datos
├── package.json                         # Dependencias y scripts de ejecución
├── index.html                           # Vista de inicio de la hoja de vida
├── experiencia.html                     # Vista interactiva con CRUD en vivo y Swagger
├── educacion.html                       # Formación académica
├── contacto.html                        # Información de contacto
└── styles.css                           # Estilos visuales personalizados
```

---

## 🛠️ Requisitos Previos

1. **Node.js**: Versión 18 o superior instalada.
2. **MongoDB**:
   - **Opción A (Recomendada y rápida - MongoDB Atlas en la nube)**: Un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - **Opción B (Local)**: MongoDB Community Server instalado y corriendo localmente en el puerto `27017`.

---

## 🚀 Instalación y Puesta en Marcha

### 1. Instalar Dependencias
Abre la terminal en la carpeta del proyecto y ejecuta:
```bash
npm install
```

### 2. Configurar Variables de Entorno (`.env`)
Revisa el archivo `.env` en la raíz del proyecto. Si usas MongoDB local:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/hoja_de_vida
```
Si usas MongoDB Atlas, reemplaza la línea `MONGODB_URI` con tu cadena de conexión:
```env
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/hoja_de_vida?retryWrites=true&w=majority
```

### 3. Poblar la Base de Datos con Datos Iniciales (Opcional pero Recomendado)
Para cargar automáticamente las 4 experiencias laborales iniciales de Jorge Meza en MongoDB, ejecuta:
```bash
npm run seed
```

### 4. Iniciar el Servidor
Para iniciar en modo normal:
```bash
npm start
```
O en modo desarrollo con recarga automática:
```bash
npm run dev
```

El servidor estará disponible en:
- 🌐 **Hoja de Vida Web:** [http://localhost:3000](http://localhost:3000)
- 💼 **Gestor de Experiencias:** [http://localhost:3000/experiencia.html](http://localhost:3000/experiencia.html)
- 📖 **Documentación Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 📑 Endpoints de la API REST

Base URL: `http://localhost:3000/api/experiencias`

| Método | Endpoint | Descripción | Cuerpo de Petición (Body) |
|---|---|---|---|
| **GET** | `/api/experiencias` | Lista todas las experiencias registradas | Ninguno |
| **GET** | `/api/experiencias/:id` | Obtiene el detalle de una experiencia por su `_id` | Ninguno |
| **POST** | `/api/experiencias` | Crea una nueva experiencia profesional | JSON con campos requeridos |
| **PUT** | `/api/experiencias/:id` | Actualiza una experiencia existente | JSON con campos a modificar |
| **DELETE** | `/api/experiencias/:id` | Elimina una experiencia por su `_id` | Ninguno |

### Esquema del Modelo (JSON)
```json
{
  "cargo": "Docente Ocasional Tiempo Completo",
  "empresa": "Escuela Naval de Cadetes Almirante Padilla (CENDOVA-ESFIM)",
  "periodo": "Feb 2025 - Dic 2025",
  "ubicacion": "Cartagena, Bolívar",
  "tipoEntidad": "Entidad Pública",
  "descripcion": "Docencia e instrucción en procesos de formación naval y académica.",
  "orden": 1
}
```

---

## 🧪 Pruebas con Swagger UI

1. Inicia el servidor con `npm start`.
2. Abre en tu navegador: **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**.
3. Podrás ver todos los endpoints agrupados bajo **Experiencias Profesionales**.
4. Haz clic en cualquier endpoint (ej. `GET /api/experiencias` o `POST /api/experiencias`), pulsa el botón **"Try it out"** y luego **"Execute"** para probar las peticiones y visualizar las respuestas HTTP en tiempo real.

---

## 📮 Pruebas con Postman

1. Abre **Postman**.
2. Haz clic en el botón **Import** (arriba a la izquierda).
3. Selecciona el archivo `HojaDeVida_Experiencias.postman_collection.json` ubicado en la raíz de este proyecto.
4. Verás la colección **"Hoja de Vida API - Experiencias Profesionales"** con las 5 peticiones preconfiguradas:
   1. `1. Obtener todas las experiencias (GET)`
   2. `2. Crear una nueva experiencia (POST)` *(Guarda automáticamente el ID generado en la variable `experienciaId`)*
   3. `3. Obtener una experiencia por ID (GET)`
   4. `4. Actualizar una experiencia por ID (PUT)`
   5. `5. Eliminar una experiencia por ID (DELETE)`
5. Ejecútalas en orden secuencial para comprobar el ciclo de vida completo del CRUD.

---

## 💻 Integración en la Interfaz Web (`experiencia.html`)

En la página web de [experiencia.html](file:///e:/DATOS/Downloads/HojaDeVida_API/experiencia.html) se integraron las siguientes mejoras:
- **Carga dinámica:** Las tarjetas se renderizan directamente consumiendo la API de Node.js y MongoDB.
- **Creación interactiva:** Botón `+ Nueva Experiencia` con ventana modal para registrar nuevos empleos.
- **Edición y eliminación:** Cada tarjeta cuenta con botones para modificar y eliminar el registro directamente en la base de datos NoSQL.
- **Acceso a Swagger:** Enlace directo a la interfaz interactiva de Swagger UI en la barra de navegación superior.
- **Modo de Respaldo (Fallback):** Si el servidor no se encuentra encendido, la interfaz muestra los datos locales sin romperse y avisa al usuario amigablemente cómo inicializar la API.

---

## ☁️ Despliegue en Vercel (Producción)

El proyecto incluye la configuración para ser desplegado como funciones Serverless en Vercel:

1. **Estructura Vercel:**
   - Archivo de configuración: `vercel.json` (enrutamiento de `/api` y `/api-docs` hacia la función serverless).
   - Entrypoint serverless: `api/index.js`.
   - Conexión optimizada para serverless con pool caching en `src/config/db.js`.

2. **Pasos para conectar con Vercel:**
   1. Ingresa a tu cuenta de Vercel en: **[https://vercel.com/jmezar](https://vercel.com/jmezar)**.
   2. Haz clic en **"Add New..."** -> **"Project"**.
   3. En la lista de repositorios de GitHub, selecciona **`jemezar/HojaDeVida_API`** y pulsa **"Import"**.
   4. En la sección **Environment Variables**, agrega la variable:
      - **Nombre:** `MONGODB_URI`
      - **Valor:** Tu cadena de conexión de MongoDB Atlas (Ej: `mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/hoja_de_vida?retryWrites=true&w=majority`).
   5. Haz clic en **"Deploy"**.
   6. ¡Listo! Vercel desplegará automáticamente la aplicación y cada nuevo `push` a GitHub actualizará el despliegue de forma continua (CI/CD).

