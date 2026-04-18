import { Router } from "express"
import { grupoController } from "../controllers/grupos.controller.js"
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js"

const router = Router()

router.post('/registrargrupo', verifyToken, verifyAdmin, grupoController.registrarGrupo)
router.get('/grupos', verifyToken, grupoController.listarGrupos)
router.get('/grupo/:id_grupo', verifyToken, grupoController.encontrarPorId)
router.put('/grupo_update/:id_grupo', verifyToken, verifyAdmin, grupoController.actualizarGrupo)

export default router