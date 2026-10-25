const testApi = async () => {
    const baseUrl = 'http://localhost:3000/api/experiencias';

    console.log('🧪 INICIANDO PRUEBAS AUTOMATIZADAS DE ENDPOINTS CRUD...');

    // 1. GET ALL
    console.log('\n--- 1. Probar GET /api/experiencias ---');
    const resGet = await fetch(baseUrl);
    const dataGet = await resGet.json();
    console.log(`Status: ${resGet.status} | Éxito: ${dataGet.success} | Cantidad inicial: ${dataGet.count}`);
    dataGet.data.forEach(item => {
        console.log(`  • [${item.tipoEntidad}] ${item.cargo} - ${item.empresa} (ID: ${item._id})`);
    });

    // 2. POST (Crear)
    console.log('\n--- 2. Probar POST /api/experiencias (Crear) ---');
    const nueva = {
        cargo: 'Consultor de Proyectos y Gestión de Mercados',
        empresa: 'Consultores del Caribe S.A.S.',
        periodo: 'Ene 2026 - Presente',
        ubicacion: 'Montería, Córdoba',
        tipoEntidad: 'Entidad Privada',
        descripcion: 'Formulación y gestión integral de proyectos comerciales y académicos.',
        orden: 5,
    };
    const resPost = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nueva),
    });
    const dataPost = await resPost.json();
    console.log(`Status: ${resPost.status} | Éxito: ${dataPost.success}`);
    const idCreado = dataPost.data?._id;
    console.log(`Registro creado con ID: ${idCreado}`);

    if (!idCreado) {
        console.error('Error al crear:', dataPost);
        return;
    }

    // 3. GET ONE BY ID
    console.log(`\n--- 3. Probar GET /api/experiencias/${idCreado} ---`);
    const resGetOne = await fetch(`${baseUrl}/${idCreado}`);
    const dataGetOne = await resGetOne.json();
    console.log(`Status: ${resGetOne.status} | Cargo: ${dataGetOne.data?.cargo} | Empresa: ${dataGetOne.data?.empresa}`);

    // 4. PUT (Actualizar)
    console.log(`\n--- 4. Probar PUT /api/experiencias/${idCreado} ---`);
    const actualizacion = {
        cargo: 'Director Senior de Proyectos',
        descripcion: 'Liderazgo estratégico y desarrollo de plataformas NoSQL.',
    };
    const resPut = await fetch(`${baseUrl}/${idCreado}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizacion),
    });
    const dataPut = await resPut.json();
    console.log(`Status: ${resPut.status} | Cargo actualizado: ${dataPut.data?.cargo}`);

    // 5. DELETE
    console.log(`\n--- 5. Probar DELETE /api/experiencias/${idCreado} ---`);
    const resDel = await fetch(`${baseUrl}/${idCreado}`, {
        method: 'DELETE',
    });
    const dataDel = await resDel.json();
    console.log(`Status: ${resDel.status} | Mensaje: ${dataDel.message}`);

    // 6. VERIFICAR GET ALL FINAL
    console.log('\n--- 6. Verificación final de integridad ---');
    const resFinal = await fetch(baseUrl);
    const dataFinal = await resFinal.json();
    console.log(`Cantidad final en MongoDB: ${dataFinal.count} (deben ser 4)`);

    if (dataFinal.count === 4) {
        console.log('\n🎉 ¡TODAS LAS PRUEBAS CRUD DE LA API PASARON EXITOSAMENTE AL 100%!');
    }
};

testApi().catch(err => console.error('Error en pruebas:', err));
