import { Router } from 'express'
import { dashboardController } from '../controllers/dashboard.controller.js'
import { verifyToken } from '../middlewares/jwt.middlewares.js'

const router = Router()

router.get(
    '/resumen',
    verifyToken,
    dashboardController.obtenerResumen
)

export default router