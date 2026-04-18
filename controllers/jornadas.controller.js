import {jornadaModel} from '../models/jornadas.model.js'

const registrarJornada = async (req, res) => {
    try {
        const {nombre, estado, fecha_inicio, fecha_fin} = req.body

        const missingFields = []
        if (!nombre) missingFields.push('nombre')
        if (estado === undefined || estado === null) missingFields.push('estado')
        if (!fecha_inicio) missingFields.push('fecha_inicio')
        if (!fecha_fin) missingFields.push('fecha_fin')

        if (missingFields.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: `Faltan los siguientes campos: ${missingFields.join(', ')}`
            })
        }

        const jornadaNueva = await jornadaModel.registrarJornada({nombre, estado, fecha_inicio, fecha_fin})

        return res.status(201).json({
            ok: true,
            msg: jornadaNueva
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const listarJornadas = async (req, res) => {
    try {
        const jornadas = await jornadaModel.listarJornadas()
        return res.json({ok: true, msg: jornadas})
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
        const {id_jornada} = req.params
        const jornada = await jornadaModel.encontrarPorId(id_jornada)

        if (!jornada) {
            return res.status(404).json({ok: false, msg: 'Jornada no encontrada'})
        }

        return res.json({ok: true, msg: jornada})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const actualizarJornada = async (req, res) => {
    try {
        const {id_jornada} = req.params
        const datoActualizado = req.body

        if (!datoActualizado || Object.keys(datoActualizado).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se proporcionaron datos para actualizar'
            })
        }

        const jornada = await jornadaModel.encontrarPorId(id_jornada)
        if (!jornada) {
            return res.status(404).json({ok: false, msg: 'Jornada no encontrada'})
        }

        const jornadaActualizada = await jornadaModel.actualizarJornada(id_jornada, datoActualizado)

        return res.json({
            ok: true,
            msg: 'Jornada actualizada correctamente',
            jornada: jornadaActualizada
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

export const jornadaController = {
    registrarJornada,
    listarJornadas,
    encontrarPorId,
    actualizarJornada
}