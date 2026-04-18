import {db} from '../database/connection.database.js'

const registrarPartido = async ({id_jornada, equipo_local, equipo_visitante, fecha_partido, hora_partido}) => {
    const query = {
        text: `
            INSERT INTO partidos (id_jornada, equipo_local, equipo_visitante, fecha_partido, hora_partido)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_partido, id_jornada, equipo_local, equipo_visitante, fecha_partido, hora_partido, estado
        `,
        values: [id_jornada, equipo_local, equipo_visitante, fecha_partido, hora_partido]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const listarPartidos = async () => {
    const query = {
        text: `
        SELECT
            p.id_partido,
            j.nombre AS jornada,
            el.nombre AS equipo_local,
            ev.nombre AS equipo_visitante,
            p.fecha_partido,
            p.hora_partido,
            p.estado
        FROM partidos p
        JOIN jornadas j ON p.id_jornada = j.id_jornada
        JOIN equipos el ON p.equipo_local = el.id_equipo
        JOIN equipos ev ON p.equipo_visitante = ev.id_equipo
        ORDER BY p.fecha_partido, p.hora_partido
        `
    }
    const {rows} = await db.query(query)
    return rows
}

const encontrarPorId = async (id_partido) => {
    const query = {
        text: `
        SELECT
            p.id_partido,
            j.nombre AS jornada,
            el.nombre AS equipo_local,
            ev.nombre AS equipo_visitante,
            p.fecha_partido,
            p.hora_partido,
            p.estado
        FROM partidos p
        JOIN jornadas j ON p.id_jornada = j.id_jornada
        JOIN equipos el ON p.equipo_local = el.id_equipo
        JOIN equipos ev ON p.equipo_visitante = ev.id_equipo
        WHERE p.id_partido = $1
        `,
        values: [id_partido]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const listarPorJornada = async (id_jornada) => {
    const query = {
        text: `
        SELECT
            p.id_partido,
            j.nombre AS jornada,
            el.nombre AS equipo_local,
            ev.nombre AS equipo_visitante,
            p.fecha_partido,
            p.hora_partido,
            p.estado
        FROM partidos p
        JOIN jornadas j ON p.id_jornada = j.id_jornada
        JOIN equipos el ON p.equipo_local = el.id_equipo
        JOIN equipos ev ON p.equipo_visitante = ev.id_equipo
        WHERE p.id_jornada = $1
        ORDER BY p.fecha_partido, p.hora_partido
        `,
        values: [id_jornada]
    }
    const {rows} = await db.query(query)
    return rows
}

const actualizarPartido = async (id_partido, updateData) => {
    const validFields = ['id_jornada', 'equipo_local', 'equipo_visitante', 'fecha_partido', 'hora_partido', 'estado']
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
    values.push(id_partido)

    const query = {
        text: `
        UPDATE partidos
        SET ${setClause}
        WHERE id_partido = $${values.length}
        RETURNING *
        `,
        values: values
    }

    const {rows} = await db.query(query)
    return rows[0]
}

export const partidoModel = {
    registrarPartido,
    listarPartidos,
    encontrarPorId,
    listarPorJornada,
    actualizarPartido
}