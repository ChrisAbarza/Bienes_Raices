import { check, validationResult } from "express-validator";

import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "Iniciar Sesión",
    });
};

const formularioRegistro = (req, res) => {
    res.render("auth/registro", {
        pagina: "Crear Cuenta",
    });
};

const registrar = async (req, res) => {
    //validación de formularios con express validator

    await check("nombre")
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .run(req);

    await check("email").isEmail().withMessage("Email inválido").run(req);

    await check("password")
        .isLength({ min: 6 })
        .withMessage("El password debe ser de al menos 6 carácteres")
        .run(req);

    await check("repetir_password")
        .equals("password")
        .withMessage("Los passwords deben coincidir")
        .run(req);

    let resultado = validationResult(req);

    //verificar que no hay errores
    if (!resultado.isEmpty()) {
        //hay errores
        return res.render("auth/registro", {
            pagina: "Crear Cuenta",
            errores: resultado.array(),
        });
    }

    const usuario = await Usuario.create(req.body);

    res.json(usuario);
};

const formularioRecuperarPassword = (req, res) => {
    res.render("auth/recuperar-password", {
        pagina: "Recuperar Password",
    });
};

export {
    formularioLogin,
    formularioRegistro,
    formularioRecuperarPassword,
    registrar,
};
