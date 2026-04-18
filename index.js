import 'dotenv/config'
import express from 'express'
import userRouter from './routes/user.route.js'
import equipoRouter from './routes/equipos.route.js'
import grupoRouter from './routes/grupos.route.js'
import jornadaRouter from './routes/jornadas.route.js'
import partidoRouter from './routes/partidos.route.js'
import resultadoRouter from './routes/resultados.route.js'
import pronosticoRouter from './routes/pronosticos.route.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.use('/api/quiniela', userRouter)
app.use('/api/quiniela/equipos', equipoRouter)
app.use('/api/quiniela/grupos', grupoRouter)
app.use('/api/quiniela/jornadas', jornadaRouter)
app.use('/api/quiniela/partidos', partidoRouter)
app.use('/api/quiniela/resultados', resultadoRouter)
app.use('/api/quiniela/pronosticos', pronosticoRouter)

const PORT = process.env.PORT || 3000

console.log('ENV:', {
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD ? '***' : 'Not set',
});

app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT))