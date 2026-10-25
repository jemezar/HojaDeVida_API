const mongoose = require('mongoose');
const Experiencia = require('../models/Experiencia');
const connectDB = require('../config/db');

// Datos predeterminados de la hoja de vida (útiles en cold starts o mientras se configura Atlas en Vercel)
const initialExperiences = [
    {
        _id: 'seed-1',
        cargo: 'Docente Ocasional Tiempo Completo',
        empresa: 'Escuela Naval de Cadetes Almirante Padilla (CENDOVA-ESFIM)',
        periodo: 'Feb 2025 - Dic 2025',
        ubicacion: 'Cartagena, Bolívar',
        tipoEntidad: 'Entidad Pública',
        descripcion: 'Formación académica, docencia y capacitación naval.',
        orden: 1,
    },
    {
        _id: 'seed-2',
        cargo: 'Docente Ocasional Tiempo Completo',
        empresa: 'Escuela Naval de Cadetes Almirante Padilla (CENDOVA-ESFIM)',
        periodo: 'Mar 2024 - Dic 2024',
        ubicacion: 'Cartagena, Bolívar',
        tipoEntidad: 'Entidad Pública',
        descripcion: 'Desarrollo curricular, tutoría y docencia académica.',
        orden: 2,
    },
    {
        _id: 'seed-3',
        cargo: 'Tutor',
        empresa: 'Iglesia de Dios Pentecostal Movimiento Internacional',
        periodo: 'Ene 2022 - Jun 2022',
        ubicacion: 'Villavicencio, Meta',
        tipoEntidad: 'Entidad Privada',
        descripcion: 'Acompañamiento pedagógico y comunitario.',
        orden: 3,
    },
    {
        _id: 'seed-4',
        cargo: 'Auxiliar Administrativo',
        empresa: 'Fundación Educativa Ana Carmela Gómez de López / COOMUSEC',
        periodo: '2016 - 2017',
        ubicacion: 'Monitos, Córdoba',
        tipoEntidad: 'Entidad Privada',
        descripcion: 'Gestión documental y apoyo administrativo institucional.',
        orden: 4,
    },
];

let inMemoryStore = [...initialExperiences];

/**
 * @desc    Obtener todas las experiencias profesionales
 * @route   GET /api/experiencias
 * @access  Público
 */
const getExperiencias = async (req, res) => {
    try {
        await connectDB();

        if (mongoose.connection.readyState === 1) {
            const total = await Experiencia.countDocuments();
            if (total === 0) {
                // Auto-sembrar si la base de datos está vacía
                await Experiencia.insertMany(initialExperiences.map(({ _id, ...rest }) => rest));
            }
            const experiencias = await Experiencia.find().sort({ orden: 1, createdAt: -1 });
            return res.status(200).json({
                success: true,
                count: experiencias.length,
                data: experiencias,
            });
        } else {
            // Si MongoDB aún no está conectado (por ejemplo, falta MONGODB_URI en Vercel)
            return res.status(200).json({
                success: true,
                count: inMemoryStore.length,
                data: inMemoryStore,
                isFallback: true,
            });
        }
    } catch (error) {
        console.error('Error al obtener experiencias:', error.message);
        return res.status(200).json({
            success: true,
            count: inMemoryStore.length,
            data: inMemoryStore,
            isFallback: true,
        });
    }
};

/**
 * @desc    Obtener una experiencia profesional por ID
 * @route   GET /api/experiencias/:id
 * @access  Público
 */
const getExperienciaById = async (req, res) => {
    try {
        const { id } = req.params;
        await connectDB();

        if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
            const experiencia = await Experiencia.findById(id);
            if (!experiencia) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ninguna experiencia con el ID: ${id}`,
                });
            }
            return res.status(200).json({
                success: true,
                data: experiencia,
            });
        }

        const fallbackItem = inMemoryStore.find(item => String(item._id) === id);
        if (fallbackItem) {
            return res.status(200).json({
                success: true,
                data: fallbackItem,
            });
        }

        return res.status(404).json({
            success: false,
            message: `No se encontró ninguna experiencia con el ID: ${id}`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al consultar la experiencia',
            error: error.message,
        });
    }
};

/**
 * @desc    Crear una nueva experiencia profesional
 * @route   POST /api/experiencias
 * @access  Público
 */
const createExperiencia = async (req, res) => {
    try {
        const { cargo, empresa, periodo, ubicacion, tipoEntidad, descripcion, orden } = req.body;

        if (!cargo || !empresa || !periodo || !ubicacion) {
            return res.status(400).json({
                success: false,
                message: 'Los campos cargo, empresa, periodo y ubicación son obligatorios',
            });
        }

        await connectDB();

        if (mongoose.connection.readyState === 1) {
            const nuevaExperiencia = await Experiencia.create({
                cargo,
                empresa,
                periodo,
                ubicacion,
                tipoEntidad: tipoEntidad || 'Entidad Privada',
                descripcion: descripcion || '',
                orden: orden !== undefined ? Number(orden) : 0,
            });

            return res.status(201).json({
                success: true,
                message: 'Experiencia profesional registrada exitosamente en MongoDB',
                data: nuevaExperiencia,
            });
        }

        // Fallback en memoria si la BD no está configurada aún en Vercel
        const itemMemoria = {
            _id: new mongoose.Types.ObjectId().toString(),
            cargo,
            empresa,
            periodo,
            ubicacion,
            tipoEntidad: tipoEntidad || 'Entidad Privada',
            descripcion: descripcion || '',
            orden: orden !== undefined ? Number(orden) : 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        inMemoryStore.push(itemMemoria);

        return res.status(201).json({
            success: true,
            message: 'Experiencia profesional registrada exitosamente',
            data: itemMemoria,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear la experiencia profesional',
            error: error.message,
        });
    }
};

/**
 * @desc    Actualizar una experiencia profesional existente
 * @route   PUT /api/experiencias/:id
 * @access  Público
 */
const updateExperiencia = async (req, res) => {
    try {
        const { id } = req.params;
        await connectDB();

        if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
            const experienciaActualizada = await Experiencia.findByIdAndUpdate(
                id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!experienciaActualizada) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró la experiencia con ID: ${id} para actualizar`,
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Experiencia profesional actualizada exitosamente en MongoDB',
                data: experienciaActualizada,
            });
        }

        const idx = inMemoryStore.findIndex(item => String(item._id) === id);
        if (idx !== -1) {
            inMemoryStore[idx] = { ...inMemoryStore[idx], ...req.body, updatedAt: new Date() };
            return res.status(200).json({
                success: true,
                message: 'Experiencia profesional actualizada exitosamente',
                data: inMemoryStore[idx],
            });
        }

        return res.status(404).json({
            success: false,
            message: `No se encontró la experiencia con ID: ${id} para actualizar`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar la experiencia profesional',
            error: error.message,
        });
    }
};

/**
 * @desc    Eliminar una experiencia profesional
 * @route   DELETE /api/experiencias/:id
 * @access  Público
 */
const deleteExperiencia = async (req, res) => {
    try {
        const { id } = req.params;
        await connectDB();

        if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
            const experienciaEliminada = await Experiencia.findByIdAndDelete(id);

            if (!experienciaEliminada) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró la experiencia con ID: ${id} para eliminar`,
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Experiencia profesional eliminada exitosamente de MongoDB',
                data: { id: experienciaEliminada._id },
            });
        }

        const idx = inMemoryStore.findIndex(item => String(item._id) === id);
        if (idx !== -1) {
            inMemoryStore.splice(idx, 1);
            return res.status(200).json({
                success: true,
                message: 'Experiencia profesional eliminada exitosamente',
                data: { id },
            });
        }

        return res.status(404).json({
            success: false,
            message: `No se encontró la experiencia con ID: ${id} para eliminar`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar la experiencia profesional',
            error: error.message,
        });
    }
};

module.exports = {
    getExperiencias,
    getExperienciaById,
    createExperiencia,
    updateExperiencia,
    deleteExperiencia,
};
