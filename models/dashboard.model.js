import { db } from '../database/connection.database.js'

const obtenerResumen = async () => {

    const query = {
        text: `
            SELECT
                (SELECT COUNT(*) FROM usuarios) usuarios,
                (SELECT COUNT(*) FROM partidos) partidos,
                (SELECT COUNT(*) FROM pronosticos) pronosticos,
                (SELECT COALESCE(SUM(puntos),0) FROM pronosticos) puntos
        `
    }

    const { rows } = await db.query(query)

    return rows[0]
}

export const dashboardModel = {
    obtenerResumen
}