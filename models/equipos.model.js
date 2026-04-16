import {db} from '../database/connection.database.js'

const registrarEquipo = async ({nombre, id_grupo})=>{
    const query={
        text:`
            INSERT INTO equipos (nombre, id_grupo)
            VALUES ($1,$2)
            RETURNING nombre, id_grupo
        `,
        values: [nombre, id_grupo]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const listarEquipos = async () => {
    const query = {
        text:`
        SELECT
        e.nombre,
        g.nombre AS grupo
        FROM equipos e 
        JOIN grupos g ON e.id_grupo = g.id_grupo
        `
    }
    const {rows} = await db.query(query)
    return rows
}

const encontrarPorNombre = async (nombre) => {
    try {
        const query = {
            text: `
            SELECT
            e.nombre,
            g.nombre AS grupo
            FROM equipos e 
            JOIN grupos g ON e.id_grupo = g.id_grupo
            WHERE e.nombre = $1
            `,
            values: [nombre]
        }
        const { rows } = await db.query(query)
        return rows.length > 0 ? rows[0] : null
    } catch (error) {
        console.error('Error al buscar equipo:', error)
        throw error
    }
}

const encontrarPorId = async (id_equipo) => {
    const query = {
        text: `
        SELECT
        e.nombre,
        g.nombre AS grupo
        FROM equipos e 
        JOIN grupos g ON e.id_grupo = g.id_grupo
        WHERE e.id_equipo = $1
        `,
        values: [id_equipo]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const actualizarEquipo = async(id_equipo, updateData)=>{
    const validFields = ['nombre','id_grupo'] // campos actualizables
    const fieldsToUpdate ={}

    Object.keys(updateData).forEach(key=>{
        if(validFields.includes(key) && updateData[key] !== undefined){
            fieldsToUpdate[key] = updateData[key]
        }
    });

    if(Object.keys(fieldsToUpdate).length === 0){
        throw new Error('No se proporcionaron campos para actualizar');
    }

     const setClause = Object.keys(fieldsToUpdate)
     .map((key,index) => `${key} = $${index +1}`)
     .join(', ');

     const values = Object.values(fieldsToUpdate)
     values.push(id_equipo)

     const query ={
        text:`
        UPDATE equipos
        SET ${setClause}
        WHERE id_equipo = $${values.length}
        RETURNING *
        `,
        values: values
     }

     const {rows} = await db.query(query)
     return rows[0]
}

const encontrarPorGrupos = async (id_equipo) => {
    const query = {
        text: `
        SELECT
        e.nombre,
        g.nombre AS grupo
        FROM equipos e 
        JOIN grupos g ON e.id_grupo = g.id_grupo
        WHERE e.id_grupo = $1
        `,
        values: [id_equipo]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const tablaEquiposPorGrupo = async () => {
    const query = {
        text:`
        SELECT
        g.nombre AS grupo,
        e.nombre AS equipo,
        COUNT(*) pj,
        SUM(CASE WHEN t.goles_favor > t.goles_contra THEN 1 ELSE 0 END) pg,
        SUM(CASE WHEN t.goles_favor = t.goles_contra THEN 1 ELSE 0 END) pe,
        SUM(CASE WHEN t.goles_favor < t.goles_contra THEN 1 ELSE 0 END) pp,
        SUM(t.goles_favor) gf,
        SUM(t.goles_contra) gc,
        SUM(t.goles_favor - t.goles_contra) dg,
        SUM(CASE 
            WHEN t.goles_favor > t.goles_contra THEN 3
            WHEN t.goles_favor = t.goles_contra THEN 1
            ELSE 0
        END) pts
        FROM equipos e
        JOIN grupos g ON e.id_grupo = g.id_grupo
        JOIN (
            SELECT p.equipo_local id_equipo, r.goles_local goles_favor, r.goles_visitante goles_contra
            FROM partidos p
            JOIN resultados r ON p.id_partido = r.id_partido
            UNION ALL
            SELECT p.equipo_visitante, r.goles_visitante, r.goles_local
            FROM partidos p
            JOIN resultados r ON p.id_partido = r.id_partido
        ) t ON e.id_equipo = t.id_equipo
        GROUP BY g.nombre, e.id_equipo, e.nombre
        ORDER BY g.nombre, pts DESC, dg DESC, gf DESC;
        `
    }
    const {rows} = await db.query(query)
    return rows
}

export const equipoModel={
    registrarEquipo,
    listarEquipos,
    encontrarPorId,
    encontrarPorNombre,
    actualizarEquipo,
    encontrarPorGrupos,
    tablaEquiposPorGrupo
}