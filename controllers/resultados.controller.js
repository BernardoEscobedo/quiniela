import {resultadoModel} from '../models/resultados.model.js'
import {partidoModel} from '../models/partidos.model.js'

const registrarResultado = async (req, res) => {
    try {
        const {id_partido, goles_local, goles_visitante} = req.body

        const missingFields = []
        if (!id_partido) missingFields.push('id_partido')
        if (goles_local === undefined || goles_local === null) missingFields.push('goles_local')
        if (goles_visitante === undefined || goles_visitante === null) missingFields.push('goles_visitante')

        if (missingFields.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: `Faltan los siguientes campos: ${missingFields.join(', ')}`
            })
        }

        const partido = await partidoModel.encontrarPorId(id_partido)
        if (!partido) {
            return res.status(404).json({ok: false, msg: 'El partido no existe'})
        }

        const resultadoExistente = await resultadoModel.encontrarPorPartido(id_partido)
        if (resultadoExistente) {
            return res.status(409).json({
                ok: false,
                msg: 'Ya existe un resultado registrado para este partido'
            })
        }

        const resultadoNuevo = await resultadoModel.registrarResultado({id_partido, goles_local, goles_visitante})

        return res.status(201).json({
            ok: true,
            msg: resultadoNuevo
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const listarResultados = async (req, res) => {
    try {
        const resultados = await resultadoModel.listarResultados()
        return res.json({ok: true, msg: resultados})
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
        const {id_resultado} = req.params
        const resultado = await resultadoModel.encontrarPorId(id_resultado)

        if (!resultado) {
            return res.status(404).json({ok: false, msg: 'Resultado no encontrado'})
        }

        return res.json({ok: true, msg: resultado})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const actualizarResultado = async (req, res) => {
    try {
        const {id_resultado} = req.params
        const datoActualizado = req.body

        if (!datoActualizado || Object.keys(datoActualizado).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se proporcionaron datos para actualizar'
            })
        }

        const resultado = await resultadoModel.encontrarPorId(id_resultado)
        if (!resultado) {
            return res.status(404).json({ok: false, msg: 'Resultado no encontrado'})
        }

        const resultadoActualizado = await resultadoModel.actualizarResultado(id_resultado, datoActualizado)

        return res.json({
            ok: true,
            msg: 'Resultado actualizado correctamente',
            resultado: resultadoActualizado
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

export const resultadoController = {
    registrarResultado,
    listarResultados,
    encontrarPorId,
    actualizarResultado
}