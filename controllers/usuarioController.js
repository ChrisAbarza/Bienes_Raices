import { check, validationResult } from "express-validator";

import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/emails.js";
const formularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "Iniciar Sesión",
    });
};

const formularioRegistro = (req, res) => {
    res.render("auth/registro", {
        pagina: "Crear Cuenta",
        csrfToken: req.csrfToken(),
    });
};

const registrar = async (req, res) => {
    //extraer los datos
    const { nombre, email, password } = req.body;
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
        .equals(password)
        .withMessage("Los passwords deben coincidir")
        .run(req);

    let resultado = validationResult(req);

    //verificar que no hay errores
    if (!resultado.isEmpty()) {
        //hay errores
        return res.render("auth/registro", {
            pagina: "Crear Cuenta",
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                nombre,
                email,
            },
        });
    }

    //verificar que el usuario no este duplicado en bd
    const existeUsuario = await Usuario.findOne({
        where: { email },
    });

    if (existeUsuario) {
        return res.render("auth/registro", {
            pagina: "Crear Cuenta",
            errores: [{ msg: "El usuario ya está registrado" }],
            csrfToken: req.csrfToken(),
            usuario: {
                nombre,
                email,
            },
        });
    }

    //almacenar usuario en bd
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId(),
    });

    //envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token,
    });

    //mostrar mensaje de confirmación
    res.render("templates/mensaje", {
        pagina: "cuenta creada correctamente",
        mensaje:
            "hemos enviado un email de confirmación, presiona en el enlace",
    });
};

const formularioRecuperarPassword = (req, res) => {
    res.render("auth/recuperar-password", {
        pagina: "Recuperar Password",
    });
};

const confirmar = async (req, res) => {
    //obtener parametros desde get
    const { token } = req.params;

    //verificar token valido
    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render("auth/confirmar-cuenta", {
            pagina: "Error al confirmar la cuenta",
            mensaje:
                "Hubo un error al confirmar la cuenta, intenta nuevamente.",
            error: true,
        });
    }

    //confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;

    //actualizar usuario
    await usuario.save();

    res.render("auth/confirmar-cuenta", {
        pagina: "Cuenta Confirmada",
        mensaje: "la cuenta se confirmó correctamente",
        error: false,
    });
};

export {
    formularioLogin,
    formularioRegistro,
    formularioRecuperarPassword,
    registrar,
    confirmar,
};
