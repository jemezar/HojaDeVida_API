const mongoose = require('mongoose');

const connectDB = async () => {
    const configuredUri = process.env.MONGODB_URI;
    const defaultLocalUri = 'mongodb://127.0.0.1:27017/hoja_de_vida';
    const uriToTry = configuredUri || defaultLocalUri;

    // Si el usuario configuró una URI explícita que NO sea el localhost por defecto (ej. MongoDB Atlas)
    const isCustomUri = configuredUri && !configuredUri.includes('127.0.0.1') && !configuredUri.includes('localhost');

    console.log(`📡 Conectando a MongoDB en: ${uriToTry.replace(/\/\/.*@/, '//<credenciales>@')}`);

    try {
        const conn = await mongoose.connect(uriToTry, {
            serverSelectionTimeoutMS: 3000,
        });

        console.log(`✅ MongoDB Conectado exitosamente: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.warn(`⚠️ No se pudo conectar a MongoDB (${uriToTry}): ${error.message}`);

        // Si es una URI personalizada de Atlas o remota, reportamos el error
        if (isCustomUri) {
            console.error('❌ Revisa tus credenciales o el acceso por IP en MongoDB Atlas.');
            return null;
        }

        // Si falló el localhost, intentamos iniciar un servidor MongoDB en memoria para desarrollo inmediato
        try {
            console.log('🔄 Intentando iniciar MongoDB en memoria (MongoMemoryServer) para pruebas inmediatas...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const memoryUri = mongod.getUri();

            const conn = await mongoose.connect(memoryUri);
            console.log(`✅ MongoDB en Memoria conectado exitosamente: ${conn.connection.name}`);

            // Auto-poblar con los datos iniciales de Jorge Meza
            const Experiencia = require('../models/Experiencia');
            const total = await Experiencia.countDocuments();
            if (total === 0) {
                const seedData = [
                    {
                        cargo: 'Docente Ocasional Tiempo Completo',
                        empresa: 'Escuela Naval de Cadetes Almirante Padilla (CENDOVA-ESFIM)',
                        periodo: 'Feb 2025 - Dic 2025',
                        ubicacion: 'Cartagena, Bolívar',
                        tipoEntidad: 'Entidad Pública',
                        descripcion: 'Formación académica, docencia y capacitación naval.',
                        orden: 1,
                    },
                    {
                        cargo: 'Docente Ocasional Tiempo Completo',
                        empresa: 'Escuela Naval de Cadetes Almirante Padilla (CENDOVA-ESFIM)',
                        periodo: 'Mar 2024 - Dic 2024',
                        ubicacion: 'Cartagena, Bolívar',
                        tipoEntidad: 'Entidad Pública',
                        descripcion: 'Desarrollo curricular, tutoría y docencia académica.',
                        orden: 2,
                    },
                    {
                        cargo: 'Tutor',
                        empresa: 'Iglesia de Dios Pentecostal Movimiento Internacional',
                        periodo: 'Ene 2022 - Jun 2022',
                        ubicacion: 'Villavicencio, Meta',
                        tipoEntidad: 'Entidad Privada',
                        descripcion: 'Acompañamiento pedagógico y comunitario.',
                        orden: 3,
                    },
                    {
                        cargo: 'Auxiliar Administrativo',
                        empresa: 'Fundación Educativa Ana Carmela Gómez de López / COOMUSEC',
                        periodo: '2016 - 2017',
                        ubicacion: 'Monitos, Córdoba',
                        tipoEntidad: 'Entidad Privada',
                        descripcion: 'Gestión documental y apoyo administrativo institucional.',
                        orden: 4,
                    },
                ];
                await Experiencia.insertMany(seedData);
                console.log('🌱 Base de datos MongoDB inicializada con 4 experiencias profesionales.');
            }

            return conn;
        } catch (memError) {
            console.error('❌ No fue posible iniciar MongoDB en memoria:', memError.message);
            console.warn('\n💡 Recuerda que puedes configurar tu cluster gratuito de MongoDB Atlas en el archivo .env:');
            console.warn('  MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/hoja_de_vida?retryWrites=true&w=majority\n');
            return null;
        }
    }
};

module.exports = connectDB;
