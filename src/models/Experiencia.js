const mongoose = require('mongoose');

const experienciaSchema = new mongoose.Schema(
    {
        cargo: {
            type: String,
            required: [true, 'El cargo o puesto es obligatorio'],
            trim: true,
        },
        empresa: {
            type: String,
            required: [true, 'La empresa o institución es obligatoria'],
            trim: true,
        },
        periodo: {
            type: String,
            required: [true, 'El periodo de trabajo es obligatorio'],
            trim: true,
        },
        ubicacion: {
            type: String,
            required: [true, 'La ubicación es obligatoria'],
            trim: true,
        },
        tipoEntidad: {
            type: String,
            trim: true,
            default: 'Entidad Privada',
        },
        descripcion: {
            type: String,
            trim: true,
            default: '',
        },
        orden: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model('Experiencia', experienciaSchema);
