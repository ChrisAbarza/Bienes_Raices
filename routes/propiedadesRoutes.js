import express from "express";
import { body } from "express-validator";
import { admin, crear, guardar } from "../controllers/propiedadController.js";

const router = express.Router();

router.get("/mis-propiedades", admin);
router.get("/propiedades/crear", crear);
router.post(
    "/propiedades/crear",
    body("titulo").notEmpty().withMessage("El titulo es obligatorio"),
    body("descripcion")
        .notEmpty()
        .withMessage("La descripcion es obligatoria")
        .isLength({ max: 200 })
        .withMessage("La descripcion debe tener maximo 200 caracteres"),
    body("categoria").isNumeric().withMessage("La categoria es obligatoria"),
    body("precio").isNumeric().withMessage("El precio es obligatorio"),
    body("habitaciones")
        .isNumeric()
        .withMessage("Las habitaciones son obligatorias"),
    body("wc").isNumeric().withMessage("Los baños son obligatorios"),
    body("estacionamiento")
        .isNumeric()
        .withMessage("los estacionamientos son obligatorios"),
    body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
    guardar
);

export default router;
