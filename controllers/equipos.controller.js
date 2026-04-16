import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import {equipoModel} from '../models/equipos.model.js'
import { request } from 'express'

const registrarEquipo = async (req, res) => {
    try {
        const { nombre, id_grupo } = req.body

        const missingFields = []
        if (!nombre || nombre.trim() === '') missingFields.push('nombre')
        if (!id_grupo) missingFields.push('id_grupo')

        if (missingFields.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: `Faltan los siguientes campos: ${missingFields.join(', ')}`
            })
        }

        const equipoNuevo = await equipoModel.registrarEquipo({ 
            nombre: nombre.trim(), 
            id_grupo 
        })

        return res.status(201).json({
            ok: true,
            equipo: equipoNuevo
        })

    } catch (error) {
        console.error(error)

        if (error.code === '23505') {
            return res.status(409).json({
                ok: false,
                msg: 'El equipo ya existe'
            })
        }

        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const listarEquipos = async(req,res)=>{
    try {
        const equipos = await equipoModel.listarEquipos()
        return res.json({ok:true, msg: equipos})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:'Error en el servidor'
        })
    }
}

export const equipoController = {
    registrarEquipo,
    listarEquipos
}