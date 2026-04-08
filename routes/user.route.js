import { Router } from "express";
import { userController } from "../controllers/user.controller.js"
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js"

const router = Router()

router.post('/login', userController.loginUsuario)
router.get('/profile', verifyToken, userController.perfilUsuario)//ruta protegida

//rutas para admin
router.get('/usuarios', verifyToken, verifyAdmin, userController.listarUsuarios )
router.post('/registrarusuario', userController.registrarUsuario)
router.put('/actualizarusuario/:id_usuario', verifyToken, verifyAdmin, userController.actualizarUsuario)

export default router