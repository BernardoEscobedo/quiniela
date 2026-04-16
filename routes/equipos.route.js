import { Router } from "express";
import { equipoController } from "../controllers/equipos.controller.js"
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js"

const router = Router()

router.post('/registrarequipo',verifyToken, equipoController.registrarEquipo)

router.get('/equiposregistrados', verifyToken, verifyAdmin, equipoController.listarEquipos)
router.get('/equipo_name/:nombre', verifyToken, verifyAdmin, equipoController.encontrarPorNombre)
router.get('/equipo_id/:id_equipo', verifyToken, verifyAdmin, equipoController.encontrarPorId)

export default router