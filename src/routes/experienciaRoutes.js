const express = require('express');
const router = express.Router();
const {
    getExperiencias,
    getExperienciaById,
    createExperiencia,
    updateExperiencia,
    deleteExperiencia,
} = require('../controllers/experienciaController');

// Rutas base: /api/experiencias
router.route('/')
    .get(getExperiencias)
    .post(createExperiencia);

// Rutas con parámetro id: /api/experiencias/:id
router.route('/:id')
    .get(getExperienciaById)
    .put(updateExperiencia)
    .delete(deleteExperiencia);

module.exports = router;
