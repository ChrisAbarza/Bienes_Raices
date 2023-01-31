import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad } from "../models/index.js";

const admin = (req, res) => {
    res.render("propiedades/admin", {
        pagina: "Mis Propiedades",
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

    const { id: usuarioId } = req.usuario;

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
            usuarioId,
            imagen: "",
        });

        const { id: propiedadId } = propiedadGuardada;

        res.redirect(`/propiedades/agregar-imagen/${propiedadId}`);
    } catch (error) {
        console.log(error);
    }
};

const agregarImagen = async (req, res) => {
    // validar que la propiedad exista y no esté publicada
    const { id } = req.params;

    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect("/mis-propiedades");
    }

    if (propiedad.publicado) {
        return res.redirect("/mis-propiedades");
    }

    //validar que la propiedad pertenezca al usuario autenticado
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect("/mis-propiedades");
    }

    res.render("propiedades/agregar-imagen", {
        pagina: `Agregar Imagen a: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad,
    });
};

export { admin, crear, guardar, agregarImagen };
