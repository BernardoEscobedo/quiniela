import { Router } from "express"
import { pronosticoController } from "../controllers/pronosticos.controller.js"
import { verifyAdmin, verifyToken, verifyParticipacion } from "../middlewares/jwt.middlewares.js"

const router = Router()

// Participantes y admin pueden registrar y ver sus propios pronósticos
router.post('/registrarpronostico', verifyToken, verifyParticipacion, pronosticoController.registrarPronostico)
router.get('/mis-pronosticos', verifyToken, verifyParticipacion, pronosticoController.listarMisPronosticos)
router.put('/pronostico_update/:id_pronostico', verifyToken, verifyParticipacion, pronosticoController.actualizarPronostico)

// Solo admin puede ver todos los pronósticos
router.get('/pronosticos', verifyToken, verifyAdmin, pronosticoController.listarPronosticos)
router.get('/pronostico/:id_pronostico', verifyToken, verifyAdmin, pronosticoController.encontrarPorId)
router.get('/pronosticos/partido/:id_partido', verifyToken, verifyAdmin, pronosticoController.listarPorPartido)

// Tabla de posiciones - accesible para todos los autenticados
router.get('/posiciones', verifyToken, pronosticoController.tablaPosicionesUsuarios)

export default router