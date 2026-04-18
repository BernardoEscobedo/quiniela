import {db} from '../database/connection.database.js'

const registrarGrupo = async ({nombre}) => {
    const query = {
        text: `
            INSERT INTO grupos (nombre)
            VALUES ($1)
            RETURNING id_grupo, nombre
        `,
        values: [nombre]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const listarGrupos = async () => {
    const query = {
        text: `
        SELECT id_grupo, nombre
        FROM grupos
        ORDER BY nombre
        `
    }
    const {rows} = await db.query(query)
    return rows
}

const encontrarPorId = async (id_grupo) => {
    const query = {
        text: `
        SELECT id_grupo, nombre
        FROM grupos
        WHERE id_grupo = $1
        `,
        values: [id_grupo]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const encontrarPorNombre = async (nombre) => {
    const query = {
        text: `
        SELECT id_grupo, nombre
        FROM grupos
        WHERE nombre = $1
        `,
        values: [nombre]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const actualizarGrupo = async (id_grupo, updateData) => {
    const validFields = ['nombre']
    const fieldsToUpdate = {}

    Object.keys(updateData).forEach(key => {
        if (validFields.includes(key) && updateData[key] !== undefined) {
            fieldsToUpdate[key] = updateData[key]
        }
    })

    if (Object.keys(fieldsToUpdate).length === 0) {
        throw new Error('No se proporcionaron campos para actualizar')
    }

    const setClause = Object.keys(fieldsToUpdate)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ')

    const values = Object.values(fieldsToUpdate)
    values.push(id_grupo)

    const query = {
        text: `
        UPDATE grupos
        SET ${setClause}
        WHERE id_grupo = $${values.length}
        RETURNING *
        `,
        values: values
    }

    const {rows} = await db.query(query)
    return rows[0]
}

export const grupoModel = {
    registrarGrupo,
    listarGrupos,
    encontrarPorId,
    encontrarPorNombre,
    actualizarGrupo
}