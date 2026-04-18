import {db} from '../database/connection.database.js'

const registrarJornada = async ({nombre, estado, fecha_inicio, fecha_fin}) => {
    const query = {
        text: `
            INSERT INTO jornadas (nombre, estado, fecha_inicio, fecha_fin)
            VALUES ($1, $2, $3, $4)
            RETURNING id_jornada, nombre, estado, fecha_inicio, fecha_fin
        `,
        values: [nombre, estado, fecha_inicio, fecha_fin]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const listarJornadas = async () => {
    const query = {
        text: `
        SELECT id_jornada, nombre, estado, fecha_inicio, fecha_fin
        FROM jornadas
        ORDER BY fecha_inicio
        `
    }
    const {rows} = await db.query(query)
    return rows
}

const encontrarPorId = async (id_jornada) => {
    const query = {
        text: `
        SELECT id_jornada, nombre, estado, fecha_inicio, fecha_fin
        FROM jornadas
        WHERE id_jornada = $1
        `,
        values: [id_jornada]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const actualizarJornada = async (id_jornada, updateData) => {
    const validFields = ['nombre', 'estado', 'fecha_inicio', 'fecha_fin']
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
    values.push(id_jornada)

    const query = {
        text: `
        UPDATE jornadas
        SET ${setClause}
        WHERE id_jornada = $${values.length}
        RETURNING *
        `,
        values: values
    }

    const {rows} = await db.query(query)
    return rows[0]
}

export const jornadaModel = {
    registrarJornada,
    listarJornadas,
    encontrarPorId,
    actualizarJornada
}