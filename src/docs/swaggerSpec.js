const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'API Hoja de Vida - Experiencias Profesionales',
        version: '1.0.0',
        description:
            'API REST para la gestión (CRUD) de información de experiencias profesionales de la hoja de vida de Jorge Meza. Desarrollada con Node.js, Express.js y MongoDB (NoSQL) para la Actividad de la Unidad 3 de la Universidad de Cartagena (CTEV).',
        contact: {
            name: 'Jorge Enrique Meza Rocha',
            email: 'jmezar@unicartagena.edu.co',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor local de desarrollo',
        },
    ],
    tags: [
        {
            name: 'Experiencias Profesionales',
            description: 'Operaciones CRUD para la información laboral de la hoja de vida',
        },
    ],
    paths: {
        '/api/experiencias': {
            get: {
                tags: ['Experiencias Profesionales'],
                summary: 'Obtener todas las experiencias profesionales',
                description: 'Retorna la lista completa de experiencias laborales registradas en la base de datos MongoDB.',
                responses: {
                    200: {
                        description: 'Lista de experiencias obtenida exitosamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        count: { type: 'integer', example: 4 },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Experiencia' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Experiencias Profesionales'],
                summary: 'Crear una nueva experiencia profesional',
                description: 'Registra una nueva experiencia laboral en la base de datos MongoDB.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ExperienciaInput' },
                            example: {
                                cargo: 'Docente Ocasional Tiempo Completo',
                                empresa: 'Escuela Naval de Cadetes Almirante Padilla (CENDOVA-ESFIM)',
                                periodo: 'Feb 2025 - Dic 2025',
                                ubicacion: 'Cartagena, Bolívar',
                                tipoEntidad: 'Entidad Pública',
                                descripcion: 'Docencia e instrucción en procesos de formación naval y académica.',
                                orden: 1,
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Experiencia registrada exitosamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Experiencia profesional registrada exitosamente' },
                                        data: { $ref: '#/components/schemas/Experiencia' },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Datos faltantes o error de validación',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                    500: {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/experiencias/{id}': {
            get: {
                tags: ['Experiencias Profesionales'],
                summary: 'Obtener una experiencia por ID',
                description: 'Busca y retorna una sola experiencia profesional por su ObjectId de MongoDB.',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'ID de la experiencia en MongoDB (ObjectId de 24 caracteres hexadecimales)',
                        schema: { type: 'string', example: '65e9a4f21d3f9b20148c3456' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Experiencia encontrada',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: { $ref: '#/components/schemas/Experiencia' },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Formato de ID inválido',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                    404: {
                        description: 'Experiencia no encontrada',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                    500: {
                        description: 'Error interno del servidor',
                    },
                },
            },
            put: {
                tags: ['Experiencias Profesionales'],
                summary: 'Actualizar una experiencia existente',
                description: 'Actualiza los campos de una experiencia profesional existente en MongoDB.',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'ID de la experiencia a actualizar',
                        schema: { type: 'string', example: '65e9a4f21d3f9b20148c3456' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ExperienciaInput' },
                            example: {
                                cargo: 'Docente Ocasional Tiempo Completo',
                                empresa: 'Escuela Naval de Cadetes Almirante Padilla (CENDOVA-ESFIM)',
                                periodo: 'Feb 2025 - Presente',
                                ubicacion: 'Cartagena, Bolívar',
                                tipoEntidad: 'Entidad Pública',
                                descripcion: 'Actualización de responsabilidades docentes.',
                                orden: 1,
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Experiencia actualizada exitosamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Experiencia profesional actualizada exitosamente' },
                                        data: { $ref: '#/components/schemas/Experiencia' },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'ID inválido o error en datos',
                    },
                    404: {
                        description: 'Experiencia no encontrada',
                    },
                    500: {
                        description: 'Error interno del servidor',
                    },
                },
            },
            delete: {
                tags: ['Experiencias Profesionales'],
                summary: 'Eliminar una experiencia',
                description: 'Elimina de MongoDB la experiencia correspondiente al ID especificado.',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'ID de la experiencia a eliminar',
                        schema: { type: 'string', example: '65e9a4f21d3f9b20148c3456' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Experiencia eliminada exitosamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Experiencia profesional eliminada exitosamente' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'string', example: '65e9a4f21d3f9b20148c3456' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'ID inválido',
                    },
                    404: {
                        description: 'Experiencia no encontrada',
                    },
                    500: {
                        description: 'Error interno del servidor',
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            ExperienciaInput: {
                type: 'object',
                required: ['cargo', 'empresa', 'periodo', 'ubicacion'],
                properties: {
                    cargo: {
                        type: 'string',
                        description: 'Cargo, puesto o rol desempeñado',
                        example: 'Docente Ocasional Tiempo Completo',
                    },
                    empresa: {
                        type: 'string',
                        description: 'Nombre de la empresa, institución u organización',
                        example: 'Escuela Naval de Cadetes Almirante Padilla (CENDOVA-ESFIM)',
                    },
                    periodo: {
                        type: 'string',
                        description: 'Rango de fechas de la experiencia',
                        example: 'Feb 2025 - Dic 2025',
                    },
                    ubicacion: {
                        type: 'string',
                        description: 'Ciudad y departamento/país',
                        example: 'Cartagena, Bolívar',
                    },
                    tipoEntidad: {
                        type: 'string',
                        enum: ['Entidad Pública', 'Entidad Privada', 'Independiente', 'Otro'],
                        description: 'Naturaleza jurídica o sector de la institución',
                        example: 'Entidad Pública',
                    },
                    descripcion: {
                        type: 'string',
                        description: 'Breve descripción de funciones o logros',
                        example: 'Docencia e instrucción en procesos de formación naval.',
                    },
                    orden: {
                        type: 'number',
                        description: 'Orden de visualización prioritario',
                        example: 1,
                    },
                },
            },
            Experiencia: {
                allOf: [
                    { $ref: '#/components/schemas/ExperienciaInput' },
                    {
                        type: 'object',
                        properties: {
                            _id: {
                                type: 'string',
                                description: 'ID autogenerado por MongoDB',
                                example: '65e9a4f21d3f9b20148c3456',
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                                example: '2026-03-01T14:20:00.000Z',
                            },
                            updatedAt: {
                                type: 'string',
                                format: 'date-time',
                                example: '2026-03-01T14:20:00.000Z',
                            },
                        },
                    },
                ],
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Descripción detallada del error' },
                    errors: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['El cargo o puesto es obligatorio'],
                    },
                },
            },
        },
    },
};

module.exports = swaggerSpec;
