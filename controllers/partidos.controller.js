import {partidoModel} from '../models/partidos.model.js'

const registrarPartido = async (req, res) => {
    try {
        const {id_jornada, equipo_local, equipo_visitante, fecha_partido, hora_partido} = req.body

        const missingFields = []
        if (!id_jornada) missingFields.push('id_jornada')
        if (!equipo_local) missingFields.push('equipo_local')
        if (!equipo_visitante) missingFields.push('equipo_visitante')
        if (!fecha_partido) missingFields.push('fecha_partido')
        if (!hora_partido) missingFields.push('hora_partido')

        if (missingFields.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: `Faltan los siguientes campos: ${missingFields.join(', ')}`
            })
        }

        if (equipo_local === equipo_visitante) {
            return res.status(400).json({
                ok: false,
                msg: 'El equipo local y visitante no pueden ser el mismo'
            })
        }

        const partidoNuevo = await partidoModel.registrarPartido({
            id_jornada, equipo_local, equipo_visitante, fecha_partido, hora_partido
        })

        return res.status(201).json({
            ok: true,
            msg: partidoNuevo
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const listarPartidos = async (req, res) => {
    try {
        const partidos = await partidoModel.listarPartidos()
        return res.json({ok: true, msg: partidos})
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
        const {id_partido} = req.params
        const partido = await partidoModel.encontrarPorId(id_partido)

        if (!partido) {
            return res.status(404).json({ok: false, msg: 'Partido no encontrado'})
        }

        return res.json({ok: true, msg: partido})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const listarPorJornada = async (req, res) => {
    try {
        const {id_jornada} = req.params
        const partidos = await partidoModel.listarPorJornada(id_jornada)
        return res.json({ok: true, msg: partidos})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

const actualizarPartido = async (req, res) => {
    try {
        const {id_partido} = req.params
        const datoActualizado = req.body

        if (!datoActualizado || Object.keys(datoActualizado).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se proporcionaron datos para actualizar'
            })
        }

        const partido = await partidoModel.encontrarPorId(id_partido)
        if (!partido) {
            return res.status(404).json({ok: false, msg: 'Partido no encontrado'})
        }

        if (datoActualizado.equipo_local && datoActualizado.equipo_visitante &&
            datoActualizado.equipo_local === datoActualizado.equipo_visitante) {
            return res.status(400).json({
                ok: false,
                msg: 'El equipo local y visitante no pueden ser el mismo'
            })
        }

        const partidoActualizado = await partidoModel.actualizarPartido(id_partido, datoActualizado)

        return res.json({
            ok: true,
            msg: 'Partido actualizado correctamente',
            partido: partidoActualizado
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

export const partidoController = {
    registrarPartido,
    listarPartidos,
    encontrarPorId,
    listarPorJornada,
    actualizarPartido
}