import {pronosticoModel} from '../models/pronosticos.model.js'
import {partidoModel} from '../models/partidos.model.js'

const registrarPronostico = async (req, res) => {
    try {
        const {id_partido, pronostico, goles_local, goles_visitante} = req.body
        const id_usuario = req.id_usuario // viene del token

        const missingFields = []
        if (!id_partido) missingFields.push('id_partido')
        if (!pronostico) missingFields.push('pronostico')

        if (missingFields.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: `Faltan los siguientes campos: ${missingFields.join(', ')}`
            })
        }

        const pronosticosValidos = ['L', 'V', 'E']
        if (!pronosticosValidos.includes(pronostico)) {
            return res.status(400).json({
                ok: false,
                msg: 'El pronóstico debe ser L (local), V (visitante) o E (empate)'
            })
        }

        const partido = await partidoModel.encontrarPorId(id_partido)
        if (!partido) {
            return res.status(404).json({ok: false, msg: 'El partido no existe'})
        }

        const pronosticoExistente = await pronosticoModel.encontrarPronosticoExistente(id_usuario, id_partido)
        if (pronosticoExistente) {
            return res.status(409).json({
                ok: false,
                msg: 'Ya existe un pronóstico para este partido'
            })
        }

        const pronosticoNuevo = await pronosticoModel.registrarPronostico({
            id_usuario, id_partido, pronostico, goles_local, goles_visitante
        })

        return res.status(201).json({
            ok: true,
            msg: pronosticoNuevo
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const listarPronosticos = async (req, res) => {
    try {
        const pronosticos = await pronosticoModel.listarPronosticos()
        return res.json({ok: true, msg: pronosticos})
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
        const {id_pronostico} = req.params
        const pronostico = await pronosticoModel.encontrarPorId(id_pronostico)

        if (!pronostico) {
            return res.status(404).json({ok: false, msg: 'Pronóstico no encontrado'})
        }

        return res.json({ok: true, msg: pronostico})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const listarMisPronosticos = async (req, res) => {
    try {
        const id_usuario = req.id_usuario // viene del token
        const pronosticos = await pronosticoModel.listarPorUsuario(id_usuario)
        return res.json({ok: true, msg: pronosticos})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const listarPorPartido = async (req, res) => {
    try {
        const {id_partido} = req.params
        const pronosticos = await pronosticoModel.listarPorPartido(id_partido)
        return res.json({ok: true, msg: pronosticos})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const tablaPosicionesUsuarios = async (req, res) => {
    try {
        const tabla = await pronosticoModel.tablaPosicionesUsuarios()
        return res.json({ok: true, msg: tabla})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const actualizarPronostico = async (req, res) => {
    try {
        const {id_pronostico} = req.params
        const datoActualizado = req.body
        const id_usuario = req.id_usuario // viene del token

        if (!datoActualizado || Object.keys(datoActualizado).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se proporcionaron datos para actualizar'
            })
        }

        const pronostico = await pronosticoModel.encontrarPorId(id_pronostico)
        if (!pronostico) {
            return res.status(404).json({ok: false, msg: 'Pronóstico no encontrado'})
        }

        if (datoActualizado.pronostico) {
            const pronosticosValidos = ['L', 'V', 'E']
            if (!pronosticosValidos.includes(datoActualizado.pronostico)) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El pronóstico debe ser L (local), V (visitante) o E (empate)'
                })
            }
        }

        const pronosticoActualizado = await pronosticoModel.actualizarPronostico(id_pronostico, datoActualizado)

        return res.json({
            ok: true,
            msg: 'Pronóstico actualizado correctamente',
            pronostico: pronosticoActualizado
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

export const pronosticoController = {
    registrarPronostico,
    listarPronosticos,
    encontrarPorId,
    listarMisPronosticos,
    listarPorPartido,
    tablaPosicionesUsuarios,
    actualizarPronostico
}