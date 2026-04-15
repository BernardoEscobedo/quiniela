import { Router } from "express";
import { equipoController } from "../controllers/equipos.controller.js"
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js"

const router = Router()

router.post('/registrarequipo',verifyToken, equipoController.registrarEquipo)

export default router