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

const listarEquipos = async(res)=>{
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

const encontrarPorNombre = async(req,res)=>{
    try {
            const {nombre} = req.params
            const equipo = await equipoModel.encontrarPorNombre(nombre)

            return res.json({ok:true, msg: equipo})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:'Error en el servidor'
        })
    }
}

const encontrarPorId = async(req,res)=>{
    try {
            const {id_equipo} = req.params
            const equipo = await equipoModel.encontrarPorId(id_equipo)

            return res.json({ok:true, msg: equipo})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:'Error en el servidor'
        })
    }
}

const actualizarEquipo = async (req, res) => {
    try {
        const { id_equipo } = req.params
        const datoActualizado = req.body

        if (!datoActualizado || Object.keys(datoActualizado).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se proporcionaron datos para actualizar'
            })
        }

        const equipo = await equipoModel.encontrarPorId(id_equipo)
        if (!equipo) {
            return res.status(404).json({
                ok: false,
                msg: 'Equipo no encontrado'
            })
        }

        if (datoActualizado.nombre && datoActualizado.nombre.trim() !== equipo.nombre) {
            const equipoExistente = await equipoModel.encontrarPorNombre(datoActualizado.nombre.trim())
            if (equipoExistente) {
                return res.status(409).json({
                    ok: false,
                    msg: 'Ya existe un equipo con ese nombre'
                })
            }
            datoActualizado.nombre = datoActualizado.nombre.trim()
        }

        const equipoActualizado = await equipoModel.actualizarEquipo(id_equipo, datoActualizado)

        return res.json({
            ok: true,
            msg: 'Equipo actualizado correctamente',
            equipo: equipoActualizado
        })

    } catch (error) {
        console.error(error)

        if (error.code === '23505') {
            return res.status(409).json({
                ok: false,
                msg: 'El nombre del equipo ya está en uso'
            })
        }

        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}
export const equipoController = {
    registrarEquipo,
    listarEquipos,
    encontrarPorNombre,
    encontrarPorId,
    actualizarEquipo
}