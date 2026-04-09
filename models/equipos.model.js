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
        SELECT nombre, id_grupo
        FROM equipos
        `
    }
    const {rows} = await db.query(query)
    return rows
}