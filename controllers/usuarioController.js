import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import Usuario from "../models/Usuario.js";
import { generarId, generarJWT } from "../helpers/tokens.js";
import { emailRegistro, emailRecuperarPass } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "Iniciar Sesión",
        csrfToken: req.csrfToken(),
    });
};

const autenticar = async (req, res) => {
    //extraer los datos
    const { email, password } = req.body;

    //validar campos
    await check("email").isEmail().withMessage("Email inválido").run(req);

    await check("password")
        .isLength({ min: 6 })
        .withMessage("El password es obligatorio")
        .run(req);

    //verificar que no hay errores
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        //hay errores
        return res.render("auth/login", {
            pagina: "Iniciar Sesión",
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        });
    }

    //validar si existe el usuario
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        //hay errores
        return res.render("auth/login", {
            pagina: "Iniciar Sesión",
            errores: [{ msg: "El usuario no existe" }],
            csrfToken: req.csrfToken(),
        });
    }

    //comprobar si el usuario esta confirmado

    if (!usuario.confirmado) {
        return res.render("auth/login", {
            pagina: "Iniciar Sesión",
            errores: [
                {
                    msg: "La cuenta no ha sido confirmada, sigue los pasos en tu correo electronico.",
                },
            ],
            csrfToken: req.csrfToken(),
        });
    }

    //revisar password

    if (!usuario.verificarPassword(password)) {
        return res.render("auth/login", {
            pagina: "Iniciar Sesión",
            errores: [
                {
                    msg: "Password incorrecto.",
                },
            ],
            csrfToken: req.csrfToken(),
        });
    }

    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

    //almacenar token en una cookie

    return res
        .cookie("_token", token, {
            httpOnly: true,
            //secure:true,
            //sameSite:true  ---ambas opciones sirven cuando se tiene certificado
        })
        .redirect("/mis-propiedades");
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
        csrfToken: req.csrfToken(),
    });
};

const resetPass = async (req, res) => {
    //extraer los datos
    const { email } = req.body;
    //validación de formularios con express validator

    await check("email").isEmail().withMessage("Email inválido").run(req);

    let resultado = validationResult(req);

    //verificar que no hay errores
    if (!resultado.isEmpty()) {
        //hay errores
        return res.render("auth/recuperar-password", {
            pagina: "Recuperar Password",
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        });
    }

    //verificar que el usuario se encuentra registrado en la bd
    const usuario = await Usuario.findOne({
        where: { email },
    });

    if (!usuario) {
        return res.render("auth/recuperar-password", {
            pagina: "Recuperar Password",
            errores: [{ msg: "El usuario no se encuentra registrado" }],
            csrfToken: req.csrfToken(),
        });
    }

    //generar nuevo token y enviar email
    usuario.token = generarId();
    //usuario.confirmado = false;

    //actualizar usuario
    await usuario.save();

    //envia email de confirmacion
    emailRecuperarPass({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token,
    });

    //mostrar mensaje de confirmación
    res.render("templates/mensaje", {
        pagina: "Reestablece tu password",
        mensaje:
            "hemos enviado un email con las instrucciones, presiona en el enlace",
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

const comprobarToken = async (req, res) => {
    //leer loken

    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render("auth/confirmar-cuenta", {
            pagina: "Error al reestablecer password",
            mensaje:
                "Hubo un error al validar la información, intenta nuevamente.",
            error: true,
        });
    }

    res.render("auth/reset-pass", {
        pagina: "Reestablece tu password",
        mensaje: "Ingresa tu nuevo password",
        csrfToken: req.csrfToken(),
    });
};
const nuevoPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

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
        return res.render("auth/reset-pass", {
            pagina: "Reestablece tu password",
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        });
    }

    const usuario = await Usuario.findOne({ where: { token } });

    //confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    //actualizar usuario
    await usuario.save();

    res.render("auth/confirmar-cuenta", {
        pagina: "Cambio de password correcto",
        mensaje: "El password fue modificado correctamente.",
        error: false,
    });
};

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    formularioRecuperarPassword,
    registrar,
    confirmar,
    resetPass,
    comprobarToken,
    nuevoPassword,
};
