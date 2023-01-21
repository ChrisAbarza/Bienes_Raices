import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad } from "../models/index.js";

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
        datos: {},
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
            datos: req.body,
        });
    }

    //destructuring con reasignacion de nombres ej (categoria: categoriaId)
    const {
        titulo,
        descripcion,
        categoria: categoriaId,
        precio: precioId,
        habitaciones,
        wc,
        estacionamiento,
        calle,
        lat,
        lng,
    } = req.body;

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            categoriaId,
            precioId,
            habitaciones,
            wc,
            estacionamiento,
            calle,
            lat,
            lng,
        });
    } catch (error) {
        console.log(error);
    }
};

export { admin, crear, guardar };
