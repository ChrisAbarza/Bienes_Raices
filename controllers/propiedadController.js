import { validationResult } from "express-validator";
import Precio from "../models/Precio.js";
import Categoria from "../models/Categoria.js";

const admin = (req, res) => {
    res.render("propiedades/admin", {
        pagina: "Mis Propiedades",
        barra: true,
    });
};

// obtener formulario para crear propiedad
const crear = async (req, res) => {
    //consultar modelo de precios y categoria
    const [precios, categorias] = await Promise.all([
        Precio.findAll(),
        Categoria.findAll(),
    ]);
    //pasar los datos a la vista
    res.render("propiedades/crear", {
        pagina: "Publicar Propiedad",
        barra: true,
        csrfToken: req.csrfToken(),
        precios,
        categorias,
    });
};

const guardar = async (req, res) => {
    //validacion de errores
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        const [precios, categorias] = await Promise.all([
            Precio.findAll(),
            Categoria.findAll(),
        ]);
        return res.render("propiedades/crear", {
            pagina: "Publicar Propiedad",
            barra: true,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            precios,
            categorias,
        });
    }
};

export { admin, crear, guardar };
