import { Router } from "express"
import { jornadaController } from "../controllers/jornadas.controller.js"
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js"

const router = Router()

router.post('/registrarjornada', verifyToken, verifyAdmin, jornadaController.registrarJornada)
router.get('/jornadas', verifyToken, jornadaController.listarJornadas)
router.get('/jornada/:id_jornada', verifyToken, jornadaController.encontrarPorId)
router.put('/jornada_update/:id_jornada', verifyToken, verifyAdmin, jornadaController.actualizarJornada)

export default router