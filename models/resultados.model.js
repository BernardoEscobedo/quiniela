import {db} from '../database/connection.database.js'

const registrarResultado = async ({id_partido, goles_local, goles_visitante}) => {
    const query = {
        text: `
            INSERT INTO resultados (id_partido, goles_local, goles_visitante)
            VALUES ($1, $2, $3)
            RETURNING id_resultado, id_partido, goles_local, goles_visitante
        `,
        values: [id_partido, goles_local, goles_visitante]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const listarResultados = async () => {
    const query = {
        text: `
        SELECT
            r.id_resultado,
            r.id_partido,
            el.nombre AS equipo_local,
            ev.nombre AS equipo_visitante,
            r.goles_local,
            r.goles_visitante,
            p.fecha_partido
        FROM resultados r
        JOIN partidos p ON r.id_partido = p.id_partido
        JOIN equipos el ON p.equipo_local = el.id_equipo
        JOIN equipos ev ON p.equipo_visitante = ev.id_equipo
        ORDER BY p.fecha_partido
        `
    }
    const {rows} = await db.query(query)
    return rows
}

const encontrarPorId = async (id_resultado) => {
    const query = {
        text: `
        SELECT
            r.id_resultado,
            r.id_partido,
            el.nombre AS equipo_local,
            ev.nombre AS equipo_visitante,
            r.goles_local,
            r.goles_visitante,
            p.fecha_partido
        FROM resultados r
        JOIN partidos p ON r.id_partido = p.id_partido
        JOIN equipos el ON p.equipo_local = el.id_equipo
        JOIN equipos ev ON p.equipo_visitante = ev.id_equipo
        WHERE r.id_resultado = $1
        `,
        values: [id_resultado]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const encontrarPorPartido = async (id_partido) => {
    const query = {
        text: `
        SELECT id_resultado, id_partido, goles_local, goles_visitante
        FROM resultados
        WHERE id_partido = $1
        `,
        values: [id_partido]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const actualizarResultado = async (id_resultado, updateData) => {
    const validFields = ['goles_local', 'goles_visitante']
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
    values.push(id_resultado)

    const query = {
        text: `
        UPDATE resultados
        SET ${setClause}
        WHERE id_resultado = $${values.length}
        RETURNING *
        `,
        values: values
    }

    const {rows} = await db.query(query)
    return rows[0]
}

export const resultadoModel = {
    registrarResultado,
    listarResultados,
    encontrarPorId,
    encontrarPorPartido,
    actualizarResultado
}