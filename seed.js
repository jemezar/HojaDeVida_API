const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Experiencia = require('./src/models/Experiencia');

const experienciasIniciales = [
    {
        cargo: 'Docente Ocasional Tiempo Completo',
        empresa: 'Escuela Naval de Cadetes Almirante Padilla (CENDOVA-ESFIM)',
        periodo: 'Feb 2025 - Dic 2025',
        ubicacion: 'Cartagena, Bolívar',
        tipoEntidad: 'Entidad Pública',
        descripcion: 'Formación académica, docencia y orientación en programas de capacitación y extensión naval.',
        orden: 1,
    },
    {
        cargo: 'Docente Ocasional Tiempo Completo',
        empresa: 'Escuela Naval de Cadetes Almirante Padilla (CENDOVA-ESFIM)',
        periodo: 'Mar 2024 - Dic 2024',
        ubicacion: 'Cartagena, Bolívar',
        tipoEntidad: 'Entidad Pública',
        descripcion: 'Desarrollo curricular, instrucción y tutoría académica a estudiantes y personal naval.',
        orden: 2,
    },
    {
        cargo: 'Tutor',
        empresa: 'Iglesia de Dios Pentecostal Movimiento Internacional',
        periodo: 'Ene 2022 - Jun 2022',
        ubicacion: 'Villavicencio, Meta',
        tipoEntidad: 'Entidad Privada',
        descripcion: 'Acompañamiento pedagógico y comunitario en proyectos sociales y formativos.',
        orden: 3,
    },
    {
        cargo: 'Auxiliar Administrativo',
        empresa: 'Fundación Educativa Ana Carmela Gómez de López / COOMUSEC',
        periodo: '2016 - 2017',
        ubicacion: 'Monitos, Córdoba',
        tipoEntidad: 'Entidad Privada',
        descripcion: 'Gestión documental, archivo, registro de datos y soporte operativo institucional.',
        orden: 4,
    },
];

const seedData = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hoja_de_vida';
        console.log(`Conectando a MongoDB para sembrado de datos iniciales...`);
        await mongoose.connect(uri);

        console.log('Limpiando colección de experiencias previa...');
        await Experiencia.deleteMany();

        console.log('Insertando experiencias iniciales de la hoja de vida...');
        const creadas = await Experiencia.insertMany(experienciasIniciales);

        console.log(`✅ ¡Éxito! Se han insertado ${creadas.length} experiencias profesionales en MongoDB.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al sembrar los datos en MongoDB:', error.message);
        console.warn('Verifica que MongoDB esté corriendo o que la variable MONGODB_URI en .env sea correcta.');
        process.exit(1);
    }
};

seedData();
