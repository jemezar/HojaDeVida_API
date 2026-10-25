const mongoose = require('mongoose');

// Cache global para conexiones Mongoose en entornos Serverless (Vercel)
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    const configuredUri = process.env.MONGODB_URI;
    const defaultLocalUri = 'mongodb://127.0.0.1:27017/hoja_de_vida';
    const isVercel = Boolean(process.env.VERCEL);
    const uriToTry = configuredUri || (isVercel ? null : defaultLocalUri);

    if (!uriToTry) {
        console.error('❌ MONGODB_URI no está configurada en las variables de entorno de Vercel.');
        console.warn('💡 En Vercel: Ve a Settings -> Environment Variables y agrega MONGODB_URI con tu cadena de MongoDB Atlas.');
        return null;
    }

    const isCustomUri = configuredUri && !configuredUri.includes('127.0.0.1') && !configuredUri.includes('localhost');

    console.log(`📡 Conectando a MongoDB en: ${uriToTry.replace(/\/\/.*@/, '//<credenciales>@')}`);

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
        };

        cached.promise = mongoose.connect(uriToTry, opts).then((mongooseInstance) => {
            console.log(`✅ MongoDB Conectado exitosamente: ${mongooseInstance.connection.host}/${mongooseInstance.connection.name}`);
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.warn(`⚠️ No se pudo conectar a MongoDB (${uriToTry}): ${error.message}`);

        // Si estamos en Vercel o usando una URI personalizada remota (Atlas)
        if (isVercel || isCustomUri) {
            console.error('❌ Revisa tus credenciales o permite el acceso por IP (0.0.0.0/0) en Network Access de MongoDB Atlas.');
            return null;
        }

        // Si falló en desarrollo local, intentar MongoMemoryServer
        try {
            console.log('🔄 Intentando iniciar MongoDB en memoria (MongoMemoryServer) para desarrollo local...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const memoryUri = mongod.getUri();

            cached.conn = await mongoose.connect(memoryUri);
            console.log(`✅ MongoDB en Memoria conectado exitosamente: ${cached.conn.connection.name}`);

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

            return cached.conn;
        } catch (memError) {
            console.error('❌ No fue posible iniciar MongoDB en memoria:', memError.message);
            return null;
        }
    }
};

module.exports = connectDB;
