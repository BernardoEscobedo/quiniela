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

const actualizarEquipo = async(id_usuario, updateData)=>{
    const validFields = ['nombre','apellido', 'correo','password_hash', 'id_role'] // campos actualizables
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
     values.push(id_usuario)

     const query ={
        text:`
        UPDATE usuarios
        SET ${setClause}
        WHERE id_usuario = $${values.length}
        RETURNING *
        `,
        values: values
     }

     const {rows} = await db.query(query)
     return rows[0]
}