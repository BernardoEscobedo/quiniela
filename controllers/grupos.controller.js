import {grupoModel} from '../models/grupos.model.js'

const registrarGrupo = async (req, res) => {
    try {
        const {nombre} = req.body

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                ok: false,
                msg: 'Faltan los siguientes campos: nombre'
            })
        }

        const grupoExistente = await grupoModel.encontrarPorNombre(nombre.trim())
        if (grupoExistente) {
            return res.status(409).json({ok: false, msg: 'El grupo ya existe'})
        }

        const grupoNuevo = await grupoModel.registrarGrupo({nombre: nombre.trim()})

        return res.status(201).json({
            ok: true,
            msg: grupoNuevo
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const listarGrupos = async (req, res) => {
    try {
        const grupos = await grupoModel.listarGrupos()
        return res.json({ok: true, msg: grupos})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const encontrarPorId = async (req, res) => {
    try {
        const {id_grupo} = req.params
        const grupo = await grupoModel.encontrarPorId(id_grupo)

        if (!grupo) {
            return res.status(404).json({ok: false, msg: 'Grupo no encontrado'})
        }

        return res.json({ok: true, msg: grupo})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const actualizarGrupo = async (req, res) => {
    try {
        const {id_grupo} = req.params
        const datoActualizado = req.body

        if (!datoActualizado || Object.keys(datoActualizado).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se proporcionaron datos para actualizar'
            })
        }

        const grupo = await grupoModel.encontrarPorId(id_grupo)
        if (!grupo) {
            return res.status(404).json({ok: false, msg: 'Grupo no encontrado'})
        }

        if (datoActualizado.nombre && datoActualizado.nombre.trim() !== grupo.nombre) {
            const grupoExistente = await grupoModel.encontrarPorNombre(datoActualizado.nombre.trim())
            if (grupoExistente) {
                return res.status(409).json({ok: false, msg: 'Ya existe un grupo con ese nombre'})
            }
            datoActualizado.nombre = datoActualizado.nombre.trim()
        }

        const grupoActualizado = await grupoModel.actualizarGrupo(id_grupo, datoActualizado)

        return res.json({
            ok: true,
            msg: 'Grupo actualizado correctamente',
            grupo: grupoActualizado
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

export const grupoController = {
    registrarGrupo,
    listarGrupos,
    encontrarPorId,
    actualizarGrupo
}