import { dashboardModel } from '../models/dashboard.model.js'

const obtenerResumen = async (req,res) => {

    try {

        const resumen = await dashboardModel.obtenerResumen()

        return res.json({
            ok:true,
            data: resumen
        })

    } catch(error){

        console.log(error)

        return res.status(500).json({
            ok:false,
            msg:'Error del servidor'
        })
    }

}

export const dashboardController = {
    obtenerResumen
}