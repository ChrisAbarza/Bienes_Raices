import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
//crear la app
const app = express();

//habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

//routing
app.use("/auth", usuarioRoutes);

//definir puertos y arrancar proyecto
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor funcionando en puerto: ${port}`);
});
