const mongoose = require('mongoose');
const Experiencia = require('../models/Experiencia');

/**
 * @desc    Obtener todas las experiencias profesionales
 * @route   GET /api/experiencias
 * @access  Público
 */
const getExperiencias = async (req, res) => {
    try {
        const experiencias = await Experiencia.find().sort({ orden: 1, createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: experiencias.length,
            data: experiencias,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las experiencias profesionales',
            error: error.message,
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'El ID proporcionado no tiene un formato válido de MongoDB ObjectId',
            });
        }

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
            message: 'Experiencia profesional registrada exitosamente',
            data: nuevaExperiencia,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación en los datos enviados',
                errors: errores,
            });
        }
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'El ID proporcionado no tiene un formato válido de MongoDB ObjectId',
            });
        }

        const experienciaActualizada = await Experiencia.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!experienciaActualizada) {
            return res.status(404).json({
                success: false,
                message: `No se encontró la experiencia con ID: ${id} para actualizar`,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Experiencia profesional actualizada exitosamente',
            data: experienciaActualizada,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación en los datos de actualización',
                errors: errores,
            });
        }
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'El ID proporcionado no tiene un formato válido de MongoDB ObjectId',
            });
        }

        const experienciaEliminada = await Experiencia.findByIdAndDelete(id);

        if (!experienciaEliminada) {
            return res.status(404).json({
                success: false,
                message: `No se encontró la experiencia con ID: ${id} para eliminar`,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Experiencia profesional eliminada exitosamente',
            data: { id: experienciaEliminada._id },
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
