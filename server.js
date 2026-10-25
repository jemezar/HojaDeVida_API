const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

// Cargar variables de entorno
dotenv.config();

const connectDB = require('./src/config/db');
const experienciaRoutes = require('./src/routes/experienciaRoutes');
const swaggerSpec = require('./src/docs/swaggerSpec');

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// En entornos tradicionales conectamos al arrancar
if (!process.env.VERCEL) {
    connectDB();
}

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para garantizar conexión a MongoDB en entornos Serverless (Vercel)
app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
    } catch (err) {
        console.error('Error conectando a BD en middleware serverless:', err.message);
    }
    next();
});

// Servir archivos estáticos del frontend de la Hoja de Vida
app.use(express.static(path.join(__dirname)));

// Documentación interactiva de la API con Swagger UI
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { background-color: #003366; }',
        customSiteTitle: 'Swagger UI - API Hoja de Vida',
    })
);

// Endpoint JSON para la especificación OpenAPI (útil para importar en Postman/Insomnia)
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Rutas de la API REST
app.use('/api/experiencias', experienciaRoutes);

// Ruta de información básica de la API
app.get('/api', (req, res) => {
    res.json({
        nombre: 'API Hoja de Vida - Experiencias Profesionales',
        version: '1.0.0',
        autor: 'Jorge Enrique Meza Rocha',
        institucion: 'Universidad de Cartagena - CTEV',
        endpoints: {
            experiencias: '/api/experiencias',
            swaggerDocs: '/api-docs',
            swaggerSpecJson: '/api-docs.json',
        },
    });
});

// Manejador de rutas no encontradas para la API
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta de API no encontrada: ${req.originalUrl}`,
    });
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Ocurrió un error inesperado en el servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// En entornos locales se inicia el servidor con listen
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`🚀 Servidor Express ejecutándose en el puerto: ${PORT}`);
        console.log(`🌐 Aplicación web:      http://localhost:${PORT}`);
        console.log(`💼 Página Experiencias: http://localhost:${PORT}/experiencia.html`);
        console.log(`📖 Documentación Swagger: http://localhost:${PORT}/api-docs`);
        console.log(`📡 Endpoint API:        http://localhost:${PORT}/api/experiencias`);
        console.log(`=======================================================`);
    });
}

module.exports = app;
