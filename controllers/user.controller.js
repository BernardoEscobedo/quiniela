import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import {userModel} from '../models/user.model.js'
import { request } from 'express'

const registrarUsuario = async (req,res) =>{
    try {
        const {nombre,apellido,correo,password_hash, id_role} = req.body

        const missingFields=[]
        if(!nombre) missingFields.push('nombre')
        if(!apellido) missingFields.push('apellido')
        if(!correo) missingFields.push('correo')
        if(!password_hash) missingFields.push('password_hash')
        if(!id_role) missingFields.push('id_role')

        if(missingFields.length > 0){
            return res.status(400).json({
                ok:false,
                msg:`Faltan los siguientes campos: ${missingFields.join(', ')}`
            })
        }
            const user = await userModel.encontrarPorCorreo(correo)
            if(user){
                return res.status(409).json({ok: false, msg: "El correo ya existe"})
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password_hash, salt)

            const usuarioNuevo = await userModel.registrarUsuario({nombre, apellido, correo, password_hash:hashedPassword, id_role})
            const token = jwt.sign({email: usuarioNuevo.correo, role_id: usuarioNuevo.id_role},
            process.env.JWT_SECRET,
            {
                expiresIn:"1h"
            }
        )
        return res.status(201).json({
            ok:true,
            msg:{
                token, role_id: usuarioNuevo.id_role
            }
        })
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            ok:false,
            msg: 'Error en el servidor'
        })
    }
}

// /api/quiniela/login
const loginUsuario = async(req,res)=>{
    try{
        const {correo, password_hash} = req.body

        const missingFields = []
        if(!correo) missingFields.push('correo')
        if(!password_hash) missingFields.push('password_hash')
        
        if(missingFields.length>0){
            return res.status(400).json({
                ok:false,
                msg: `Faltan los siguientes campos: ${missingFields.join(', ')}`
            });
        }
        const usuario = await userModel.encontrarPorCorreo(correo)
        if(!usuario){
            return res.status(404).json({ok:false, msg:"Correo no encontrado"})
        }

        const isMatch=await bcrypt.compare(password_hash, usuario.password_hash)

        if(!isMatch){
            return res.status(401).json({ok: false, msg:"Contraseña incorrecta"})
        }

        const token = jwt.sign({correo: usuario.correo, id_role: usuario.id_role},
            process.env.JWT_SECRET,
            {
                expiresIn:"2h"
            }
        )

        return res.json({
            ok:true,
            token,
            usuario:{
                id_usuario: usuario.id_usuario,
                correo: usuario.correo,
                role: usuario.id_role
            }
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg: 'Error en el servidor'
        })
    }
}

const perfilUsuario = async(req,res)=>{
    try {
        const usuario = await userModel.encontrarPorCorreo(req.correo)
        return res.json({
            ok:true,
            usuario:{
                correo: usuario.correo,
               id_role: usuario.id_role
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:'Error en el servidor'
        })
    }
}

const listarUsuarios = async(req,res)=>{
    try {
        const usuarios = await userModel.listarUsuarios()

        return res.json({ok:true, msg: usuarios})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:'Error en el servidor'
        })
    }
}

const actualizarUsuario = async(req,res) => {
    try {
        const {id_usuario} = req.params
        const datoActualizado = req.body

        if(!datoActualizado || Object.keys(datoActualizado).length === 0){
            return res.status(400).json({
                ok:false,
                msg:'No se proporcionaron datos para actualizar'
            })
        }

        const usuario = await userModel.encontrarPorId(id_usuario)
        if(!usuario){
            return res.status(404).json({
                ok:false,
                msg:'Usuario no encontrado'
            })
        }

        if(datoActualizado.correo && datoActualizado.correo !== usuario.correo){
            const usuarioExistente = await userModel.encontrarPorCorreo(datoActualizado.correo)
            if(usuarioExistente){
                return res.status(409).json({
                    ok: false,
                    msg: 'El correo ya esta en uso por otro usuario'
                })
            }
        }

        if(datoActualizado.password_hash){
            const salt = await bcrypt.genSalt(10)
            datoActualizado.password_hash = await bcrypt.hash(datoActualizado.password_hash, salt)
        }

        const actualizarDato = await userModel.actualizarUsuario(id_usuario, datoActualizado)

        return res.json({
            ok: true,
            msg: 'Usuario actualizado correctamente',
            usuario: actualizarDato
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:'Error en el servidor'
        })
    }
}

export const userController = {
    registrarUsuario,
    loginUsuario,
    perfilUsuario,
    listarUsuarios,
    actualizarUsuario
}