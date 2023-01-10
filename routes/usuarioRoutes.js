import express from "express";
import {
    formularioLogin,
    formularioRegistro,
    formularioRecuperarPassword,
    registrar,
    confirmar,
    resetPass,
    comprobarToken,
    nuevoPassword,
} from "../controllers/usuarioController.js";

const router = express.Router();

//routing
router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/recuperar-password", formularioRecuperarPassword);
router.post("/recuperar-password", resetPass);

router.get("/confirmar/:token", confirmar);

//rutas para reestablecer password
router.get("/recuperar-password/:token", comprobarToken);
router.post("/recuperar-password/:token", nuevoPassword);

export default router;
