import { Router } from "express"
import { partidoController } from "../controllers/partidos.controller.js"
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js"

const router = Router()

router.post('/registrarpartido', verifyToken, verifyAdmin, partidoController.registrarPartido)
router.get('/partidos', verifyToken, partidoController.listarPartidos)
router.get('/partido/:id_partido', verifyToken, partidoController.encontrarPorId)
router.get('/partidos/jornada/:id_jornada', verifyToken, partidoController.listarPorJornada)
router.put('/partido_update/:id_partido', verifyToken, verifyAdmin, partidoController.actualizarPartido)

export default router