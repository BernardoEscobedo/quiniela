import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    let token = req.headers.authorization

    if(!token || !token.startsWith('Bearer')){
        return res.status(401).json({error: "Formato de token invalido"})
    }

    console.log({token})
    token = token.split(" ")[1]

    console.log({token})

    try {
        const {correo, id_role} = jwt.verify(token, process.env.JWT_SECRET)
        console.log(correo)
        req.correo = correo
        req.id_role = id_role
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: "Token invalido"})
    }
}

export const verifyAdmin = ( req,res,next ) => {
    
}