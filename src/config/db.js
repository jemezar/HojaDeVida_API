const mongoose = require('mongoose');

// Cache global para conexiones Mongoose en entornos Serverless (Vercel)
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    const configuredUri = process.env.MONGODB_URI;
    const defaultLocalUri = 'mongodb://127.0.0.1:27017/hoja_de_vida';
    const isVercel = Boolean(process.env.VERCEL);
    const uriToTry = configuredUri || (isVercel ? null : defaultLocalUri);

    if (!uriToTry) {
        console.warn('⚠️ MONGODB_URI no está configurada.');
        return null;
    }

    if (!cached.promise) {
        const opts = {
            serverSelectionTimeoutMS: 5000,
        };

        cached.promise = mongoose.connect(uriToTry, opts).then((mongooseInstance) => {
            console.log(`✅ MongoDB Conectado exitosamente: ${mongooseInstance.connection.host}/${mongooseInstance.connection.name}`);
            return mongooseInstance;
        }).catch((err) => {
            cached.promise = null;
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.warn(`⚠️ No se pudo conectar a MongoDB (${uriToTry}): ${error.message}`);
        return null;
    }
};

module.exports = connectDB;
