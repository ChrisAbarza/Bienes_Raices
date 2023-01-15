const admin = (req, res) => {
    res.render("propiedades/admin", {
        pagina: "Mis Propiedades",
        barra: true,
    });
};

// obtener formulario para crear propiedad
const crear = (req, res) => {
    res.render("propiedades/crear", {
        pagina: "Publicar Propiedad",
        barra: true,
        csrfToken: req.csrfToken(),
    });
};

export { admin, crear };
