import {db} from '../database/connection.database.js'

const registrarPronostico = async ({id_usuario, id_partido, pronostico, goles_local, goles_visitante}) => {
    const query = {
        text: `
            INSERT INTO pronosticos (id_usuario, id_partido, pronostico, goles_local, goles_visitante)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_pronostico, id_usuario, id_partido, pronostico, goles_local, goles_visitante, puntos
        `,
        values: [id_usuario, id_partido, pronostico, goles_local ?? null, goles_visitante ?? null]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const listarPronosticos = async () => {
    const query = {
        text: `
        SELECT
            pr.id_pronostico,
            u.nombre AS usuario,
            u.apellido,
            el.nombre AS equipo_local,
            ev.nombre AS equipo_visitante,
            pr.pronostico,
            pr.goles_local,
            pr.goles_visitante,
            pr.puntos
        FROM pronosticos pr
        JOIN usuarios u ON pr.id_usuario = u.id_usuario
        JOIN partidos p ON pr.id_partido = p.id_partido
        JOIN equipos el ON p.equipo_local = el.id_equipo
        JOIN equipos ev ON p.equipo_visitante = ev.id_equipo
        ORDER BY pr.id_pronostico
        `
    }
    const {rows} = await db.query(query)
    return rows
}

const encontrarPorId = async (id_pronostico) => {
    const query = {
        text: `
        SELECT
            pr.id_pronostico,
            u.nombre AS usuario,
            u.apellido,
            el.nombre AS equipo_local,
            ev.nombre AS equipo_visitante,
            pr.pronostico,
            pr.goles_local,
            pr.goles_visitante,
            pr.puntos
        FROM pronosticos pr
        JOIN usuarios u ON pr.id_usuario = u.id_usuario
        JOIN partidos p ON pr.id_partido = p.id_partido
        JOIN equipos el ON p.equipo_local = el.id_equipo
        JOIN equipos ev ON p.equipo_visitante = ev.id_equipo
        WHERE pr.id_pronostico = $1
        `,
        values: [id_pronostico]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const listarPorUsuario = async (id_usuario) => {
    const query = {
        text: `
        SELECT
            pr.id_pronostico,
            el.nombre AS equipo_local,
            ev.nombre AS equipo_visitante,
            p.fecha_partido,
            p.hora_partido,
            pr.pronostico,
            pr.goles_local,
            pr.goles_visitante,
            pr.puntos
        FROM pronosticos pr
        JOIN partidos p ON pr.id_partido = p.id_partido
        JOIN equipos el ON p.equipo_local = el.id_equipo
        JOIN equipos ev ON p.equipo_visitante = ev.id_equipo
        WHERE pr.id_usuario = $1
        ORDER BY p.fecha_partido
        `,
        values: [id_usuario]
    }
    const {rows} = await db.query(query)
    return rows
}

const listarPorPartido = async (id_partido) => {
    const query = {
        text: `
        SELECT
            pr.id_pronostico,
            u.nombre AS usuario,
            u.apellido,
            pr.pronostico,
            pr.goles_local,
            pr.goles_visitante,
            pr.puntos
        FROM pronosticos pr
        JOIN usuarios u ON pr.id_usuario = u.id_usuario
        WHERE pr.id_partido = $1
        `,
        values: [id_partido]
    }
    const {rows} = await db.query(query)
    return rows
}

const encontrarPronosticoExistente = async (id_usuario, id_partido) => {
    const query = {
        text: `
        SELECT id_pronostico FROM pronosticos
        WHERE id_usuario = $1 AND id_partido = $2
        `,
        values: [id_usuario, id_partido]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const actualizarPronostico = async (id_pronostico, updateData) => {
    const validFields = ['pronostico', 'goles_local', 'goles_visitante']
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
    values.push(id_pronostico)

    const query = {
        text: `
        UPDATE pronosticos
        SET ${setClause}
        WHERE id_pronostico = $${values.length}
        RETURNING *
        `,
        values: values
    }

    const {rows} = await db.query(query)
    return rows[0]
}

const tablaPosicionesUsuarios = async () => {
    const query = {
        text: `
        SELECT
            u.nombre,
            u.apellido,
            SUM(p.puntos) AS puntos
        FROM usuarios u
        LEFT JOIN pronosticos p ON u.id_usuario = p.id_usuario
        GROUP BY u.id_usuario, u.nombre, u.apellido
        ORDER BY puntos DESC
        `
    }
    const {rows} = await db.query(query)
    return rows
}

export const pronosticoModel = {
    registrarPronostico,
    listarPronosticos,
    encontrarPorId,
    listarPorUsuario,
    listarPorPartido,
    encontrarPronosticoExistente,
    actualizarPronostico,
    tablaPosicionesUsuarios
}