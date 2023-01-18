import categorias from "./categorias.js";
import Categoria from "../models/Categoria.js";
import precios from "./precios.js";
import Precio from "../models/Precio.js";
import db from "../config/db.js";

const importarDatos = async () => {
    try {
        //autenticar la base de datos
        await db.authenticate();

        //sincronizar la base de datos (crear columnas)
        await db.sync({ force: true });

        //importar los datos

        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
        ]);
        console.log("Datos importados correctamente");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const eliminarDatos = async () => {
    try {
        //autenticar la base de datos
        await db.authenticate();

        //eliminar los datos mediante truncate
        await Promise.all([
            Categoria.destroy({ where: {}, truncate: true }),
            Precio.destroy({ where: {}, truncate: true }),
        ]);
        console.log("Datos eliminados correctamente");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

if (process.argv[2] === "-i") {
    importarDatos();
}

if (process.argv[2] === "-d") {
    eliminarDatos();
}
