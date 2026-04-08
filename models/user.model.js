import {db} from '../database/connection.database.js'

const registrarUsuario = async ({nombre, apellido, correo, password_hash, id_role})=>{
    const query={
        text:`
            INSERT INTO usuarios (nombre, apellido, correo, password_hash, id_role)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING id_usuario, nombre, apellido, correo, password_hash, id_role
        `,
        values: [nombre, apellido, correo, password_hash, id_role]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const listarUsuarios = async () => {
    const query = {
        text:`
        SELECT id_usuario, nombre, apellido, correo, id_role
        FROM usuarios
        `
    }
    const {rows} = await db.query(query)
    return rows
}


const encontrarPorCorreo = async(correo)=>{
    const query ={
        text: `
        SELECT id_usuario, nombre, apellido, correo, password_hash, id_role
        FROM usuarios
        WHERE correo = $1
        `,
        values: [correo]
    }
    const {rows} = await db.query(query);
    return rows[0]
}

const encontrarPorId = async (id_usuario) => {
    const query = {
        text: `
        SELECT id_usuario, nombre, apellido, correo, password_hash, id_role
        FROM usuarios WHERE id_usuario = $1
        `,
        values: [id_usuario]
    }
    const {rows} = await db.query(query)
    return rows[0]
}

const actualizarUsuario = async(id_usuario, updateData)=>{
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

export const userModel={
    registrarUsuario,
    listarUsuarios,
    encontrarPorCorreo,
    encontrarPorId,
    actualizarUsuario
}