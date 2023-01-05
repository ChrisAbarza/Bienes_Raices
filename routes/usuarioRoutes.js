import express from "express";
import {
    formularioLogin,
    formularioRegistro,
    formularioRecuperarPassword,
    registrar,
} from "../controllers/usuarioController.js";

const router = express.Router();

//routing
router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/recuperar-password", formularioRecuperarPassword);

export default router;
