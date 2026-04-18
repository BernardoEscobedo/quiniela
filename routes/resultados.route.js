import { Router } from "express"
import { resultadoController } from "../controllers/resultados.controller.js"
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js"

const router = Router()

router.post('/registrarresultado', verifyToken, verifyAdmin, resultadoController.registrarResultado)
router.get('/resultados', verifyToken, resultadoController.listarResultados)
router.get('/resultado/:id_resultado', verifyToken, resultadoController.encontrarPorId)
router.put('/resultado_update/:id_resultado', verifyToken, verifyAdmin, resultadoController.actualizarResultado)

export default router