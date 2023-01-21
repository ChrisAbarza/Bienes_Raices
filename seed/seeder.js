import categorias from "./categorias.js";
import precios from "./precios.js";
import db from "../config/db.js";
import { Categoria, Precio } from "../models/index.js";

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
        //eliminar los datos mediante truncate
        await Promise.all([
            Categoria.destroy({ where: {} }),
            Precio.destroy({ where: {} }),
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
