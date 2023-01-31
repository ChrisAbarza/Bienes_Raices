import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";

const protegerRuta = async (req, res, next) => {
    //verificar existencia del token
    const { _token } = req.cookies;
    if (!_token) {
        res.redirect("/auth/login");
        return;
    }

    //comprobar el token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await Usuario.scope("sinPassword").findByPk(decoded.id);

        //almacenar el usuario en la request
        if (usuario) {
            req.usuario = usuario;
        } else {
            return res.redirect("/auth/login");
        }
        return next();
    } catch (error) {
        return res.clearCookie("_token").redirect("/auth/login");
    }
};

export default protegerRuta;
