import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";
//crear la app
const app = express();

//habilitar lectura desde formularios
app.use(express.urlencoded({ extended: true }));
//conectar a la bd
try {
    await db.authenticate();
    db.sync();
    console.log("conectado a bd");
} catch (error) {
    console.log(error);
}

//habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

//carpeta publica
app.use(express.static("public"));

//routing
app.use("/auth", usuarioRoutes);

//definir puertos y arrancar proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor funcionando en puerto: ${port}`);
});
